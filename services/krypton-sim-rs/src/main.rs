//! Krypton Simulation Engine — Monte Carlo + Backtest
//!
//! Provides:
//! - Monte Carlo simulation of portfolio outcomes
//! - Backtesting against historical data
//! - Stress testing with price shocks
//! - Feasibility band computation for the Policy Compiler

use rand::prelude::*;
use rand_distr::{Distribution, Normal};
use serde::{Deserialize, Serialize};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub asset: String,
    pub value_usd: f64,
    pub leverage: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Portfolio {
    pub positions: Vec<Position>,
    pub nav_usd: f64,
    pub cash_usd: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConstraintParams {
    pub max_drawdown_pct: f64,
    pub max_leverage: f64,
    pub max_concentration_pct: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SimulationConfig {
    pub num_scenarios: usize,
    pub time_horizon_days: usize,
    pub confidence_level: f64, // e.g. 0.95 for VaR95
    pub seed: Option<u64>,
}

impl Default for SimulationConfig {
    fn default() -> Self {
        Self {
            num_scenarios: 1000,
            time_horizon_days: 30,
            confidence_level: 0.95,
            seed: None,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SimulationResult {
    pub passed: bool,
    pub expected_return_pct: f64,
    pub max_drawdown_pct: f64,
    pub var95_pct: f64,
    pub leverage_bps: f64,
    pub concentration_bps: f64,
    pub scenarios_run: usize,
    pub constraint_failures: usize,
    pub failure_rate: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BacktestResult {
    pub total_return_pct: f64,
    pub max_drawdown_pct: f64,
    pub sharpe_ratio: f64,
    pub sortino_ratio: f64,
    pub win_rate: f64,
    pub num_trades: usize,
    pub profitable_trades: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FeasibilityBand {
    pub target_type: String,
    pub target_value: f64,
    pub time_horizon_days: usize,
    pub min_historical_drawdown_pct: f64,
    pub max_historical_drawdown_pct: f64,
    pub feasible: bool,
    pub negotiation_prompt: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StressTestResult {
    pub shock_pct: f64,
    pub resulting_nav: f64,
    pub resulting_drawdown_pct: f64,
    pub breaches_constraints: bool,
    pub recovery_days: Option<usize>,
}

// ---------------------------------------------------------------------------
// Monte Carlo Simulation
// ---------------------------------------------------------------------------

/// Run Monte Carlo simulation on a portfolio given constraints.
pub fn simulate(
    portfolio: &Portfolio,
    constraints: &ConstraintParams,
    config: &SimulationConfig,
) -> SimulationResult {
    let mut rng = match config.seed {
        Some(s) => StdRng::seed_from_u64(s),
        None => StdRng::from_entropy(),
    };

    let daily_return_mean = 0.0002; // ~5% annualized
    let daily_return_std = 0.02; // ~32% annualized vol

    let normal = Normal::new(daily_return_mean, daily_return_std).unwrap();
    let mut failures = 0;
    let mut total_return = 0.0;
    let mut max_dd = 0.0;
    let mut final_values: Vec<f64> = Vec::with_capacity(config.num_scenarios);

    for _ in 0..config.num_scenarios {
        let mut nav = portfolio.nav_usd;
        let mut peak = nav;
        let mut scenario_max_dd = 0.0;
        let mut scenario_breached = false;

        for _ in 0..config.time_horizon_days {
            let daily_return = normal.sample(&mut rng);
            nav *= 1.0 + daily_return;

            // Apply leverage effect
            let gross_exposure: f64 = portfolio.positions.iter().map(|p| p.value_usd * p.leverage).sum();
            let leverage = if portfolio.nav_usd > 0.0 { gross_exposure / portfolio.nav_usd } else { 1.0 };

            if leverage > constraints.max_leverage {
                scenario_breached = true;
            }

            if nav > peak {
                peak = nav;
            }

            let dd = if peak > 0.0 { (peak - nav) / peak * 100.0 } else { 0.0 };
            if dd > scenario_max_dd {
                scenario_max_dd = dd;
            }
            if dd > constraints.max_drawdown_pct {
                scenario_breached = true;
            }
        }

        let scenario_return = (nav - portfolio.nav_usd) / portfolio.nav_usd * 100.0;
        total_return += scenario_return;
        if scenario_max_dd > max_dd {
            max_dd = scenario_max_dd;
        }
        if scenario_breached {
            failures += 1;
        }
        final_values.push(nav);
    }

    // Calculate VaR
    final_values.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let var_index = ((1.0 - config.confidence_level) * final_values.len() as f64) as usize;
    let var_nav = final_values.get(var_index).copied().unwrap_or(0.0);
    let var95 = (portfolio.nav_usd - var_nav) / portfolio.nav_usd * 100.0;

    let failure_rate = failures as f64 / config.num_scenarios as f64;
    let passed = failure_rate < 0.1; // Less than 10% failure rate

    SimulationResult {
        passed,
        expected_return_pct: total_return / config.num_scenarios as f64,
        max_drawdown_pct: max_dd,
        var95_pct: var95.max(0.0),
        leverage_bps: 0.0, // TODO: track from simulation
        concentration_bps: 0.0,
        scenarios_run: config.num_scenarios,
        constraint_failures: failures,
        failure_rate,
    }
}

// ---------------------------------------------------------------------------
// Backtesting
// ---------------------------------------------------------------------------

/// Simple backtest: given a series of daily returns, compute performance metrics.
pub fn backtest(daily_returns: &[f64]) -> BacktestResult {
    if daily_returns.is_empty() {
        return BacktestResult {
            total_return_pct: 0.0,
            max_drawdown_pct: 0.0,
            sharpe_ratio: 0.0,
            sortino_ratio: 0.0,
            win_rate: 0.0,
            num_trades: 0,
            profitable_trades: 0,
        };
    }

    let mut nav = 1.0;
    let mut peak = 1.0;
    let mut max_dd = 0.0;
    let mut profitable = 0;
    let mut daily_pnl: Vec<f64> = Vec::with_capacity(daily_returns.len());

    for ret in daily_returns {
        nav *= 1.0 + ret;
        if nav > peak {
            peak = nav;
        }
        let dd = (peak - nav) / peak * 100.0;
        if dd > max_dd {
            max_dd = dd;
        }
        if *ret > 0.0 {
            profitable += 1;
        }
        daily_pnl.push(*ret);
    }

    let total_return = (nav - 1.0) * 100.0;
    let mean_return = daily_pnl.iter().sum::<f64>() / daily_pnl.len() as f64;
    let std_return = (daily_pnl.iter().map(|r| (r - mean_return).powi(2)).sum::<f64>()
        / daily_pnl.len() as f64)
        .sqrt();

    let downside: Vec<f64> = daily_pnl.iter().filter(|r| **r < 0.0).copied().collect();
    let downside_std = if downside.is_empty() {
        0.001 // Avoid division by zero
    } else {
        (downside.iter().map(|r| r.powi(2)).sum::<f64>() / downside.len() as f64).sqrt()
    };

    let annual_factor = 252.0_f64.sqrt();
    let sharpe = if std_return > 0.0 {
        mean_return / std_return * annual_factor
    } else {
        0.0
    };
    let sortino = if downside_std > 0.0 {
        mean_return / downside_std * annual_factor
    } else {
        0.0
    };

    BacktestResult {
        total_return_pct: total_return,
        max_drawdown_pct: max_dd,
        sharpe_ratio: sharpe,
        sortino_ratio: sortino,
        win_rate: profitable as f64 / daily_returns.len() as f64,
        num_trades: daily_returns.len(),
        profitable_trades: profitable,
    }
}

// ---------------------------------------------------------------------------
// Stress Testing
// ---------------------------------------------------------------------------

/// Apply a price shock to a portfolio and check constraint breaches.
pub fn stress_test(
    portfolio: &Portfolio,
    constraints: &ConstraintParams,
    shock_pct: f64,
) -> StressTestResult {
    let shocked_nav = portfolio.nav_usd * (1.0 + shock_pct / 100.0);
    let drawdown = if portfolio.nav_usd > 0.0 {
        (portfolio.nav_usd - shocked_nav) / portfolio.nav_usd * 100.0
    } else {
        0.0
    };

    let breaches = drawdown > constraints.max_drawdown_pct;

    // Estimate recovery days (simplified)
    let recovery_days = if breaches {
        let daily_recovery_rate = 0.001; // ~0.1% daily recovery
        if daily_recovery_rate > 0.0 {
            Some((drawdown / (daily_recovery_rate * 100.0)).ceil() as usize)
        } else {
            None
        }
    } else {
        None
    };

    StressTestResult {
        shock_pct,
        resulting_nav: shocked_nav,
        resulting_drawdown_pct: drawdown,
        breaches_constraints: breaches,
        recovery_days,
    }
}

// ---------------------------------------------------------------------------
// Feasibility Bands
// ---------------------------------------------------------------------------

/// Compute feasibility band for a given target return and time horizon.
/// Used by the Policy Compiler's feasibility check.
pub fn compute_feasibility_band(
    target_type: &str,
    target_value: f64,
    time_horizon_days: usize,
    max_acceptable_drawdown_pct: f64,
) -> FeasibilityBand {
    // Historical reference bands (simplified — in Phase 2, these come from backtest corpus)
    let annualized_factor = target_value.powf(365.0 / time_horizon_days.max(1) as f64);

    let (min_dd, max_dd) = if annualized_factor < 1.5 {
        (1.0, 5.0)
    } else if annualized_factor < 3.0 {
        (5.0, 15.0)
    } else if annualized_factor < 6.0 {
        (15.0, 30.0)
    } else if annualized_factor < 15.0 {
        (30.0, 50.0)
    } else {
        (40.0, 70.0)
    };

    let feasible = max_acceptable_drawdown_pct >= min_dd;

    let negotiation_prompt = if !feasible {
        Some(format!(
            "A {}x target in {} days historically requires strategies with {}-{}%+ drawdown risk. \
             Your {}% drawdown limit and this target are not jointly achievable. \
             Consider raising drawdown tolerance, extending horizon, or advisory-only mode.",
            target_value, time_horizon_days, min_dd as i32, max_dd as i32,
            max_acceptable_drawdown_pct as i32
        ))
    } else {
        None
    };

    FeasibilityBand {
        target_type: target_type.to_string(),
        target_value,
        time_horizon_days,
        min_historical_drawdown_pct: min_dd,
        max_historical_drawdown_pct: max_dd,
        feasible,
        negotiation_prompt,
    }
}

// ---------------------------------------------------------------------------
// Main (CLI entry point for Phase 2)
// ---------------------------------------------------------------------------

fn main() {
    let args: Vec<String> = std::env::args().collect();

    match args.get(1).map(|s| s.as_str()) {
        Some("simulate") => {
            let portfolio = Portfolio {
                positions: vec![
                    Position { asset: "SOL".into(), value_usd: 5000.0, leverage: 1.0 },
                    Position { asset: "USDC".into(), value_usd: 5000.0, leverage: 1.0 },
                ],
                nav_usd: 10000.0,
                cash_usd: 1000.0,
            };
            let constraints = ConstraintParams {
                max_drawdown_pct: 10.0,
                max_leverage: 2.0,
                max_concentration_pct: 50.0,
            };
            let config = SimulationConfig::default();
            let result = simulate(&portfolio, &constraints, &config);
            println!("{}", serde_json::to_string_pretty(&result).unwrap());
        }
        Some("backtest") => {
            // Generate sample daily returns for demo
            let returns: Vec<f64> = (0..252).map(|i| {
                let base = 0.0003;
                let noise = ((i as f64 * 0.1).sin() * 0.01) + ((i as f64 * 0.7).cos() * 0.005);
                base + noise
            }).collect();
            let result = backtest(&returns);
            println!("{}", serde_json::to_string_pretty(&result).unwrap());
        }
        Some("stress") => {
            let shock: f64 = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(-20.0);
            let portfolio = Portfolio {
                positions: vec![
                    Position { asset: "SOL".into(), value_usd: 8000.0, leverage: 1.5 },
                    Position { asset: "USDC".into(), value_usd: 2000.0, leverage: 1.0 },
                ],
                nav_usd: 10000.0,
                cash_usd: 500.0,
            };
            let constraints = ConstraintParams {
                max_drawdown_pct: 10.0,
                max_leverage: 2.0,
                max_concentration_pct: 50.0,
            };
            let result = stress_test(&portfolio, &constraints, shock);
            println!("{}", serde_json::to_string_pretty(&result).unwrap());
        }
        Some("feasibility") => {
            let target: f64 = args.get(2).and_then(|s| s.parse().ok()).unwrap_or(5.0);
            let days: usize = args.get(3).and_then(|s| s.parse().ok()).unwrap_or(70);
            let max_dd: f64 = args.get(4).and_then(|s| s.parse().ok()).unwrap_or(5.0);
            let result = compute_feasibility_band("multiple", target, days, max_dd);
            println!("{}", serde_json::to_string_pretty(&result).unwrap());
        }
        _ => {
            println!("krypton-sim-rs v0.1.0");
            println!("Usage:");
            println!("  krypton-sim-rs simulate              — Run Monte Carlo simulation");
            println!("  krypton-sim-rs backtest               — Run backtest on sample data");
            println!("  krypton-sim-rs stress <shock_pct>     — Run stress test");
            println!("  krypton-sim-rs feasibility <target> <days> <max_dd> — Compute feasibility band");
        }
    }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

#[cfg(test)]
mod tests {
    use super::*;

    fn test_portfolio() -> Portfolio {
        Portfolio {
            positions: vec![
                Position { asset: "SOL".into(), value_usd: 5000.0, leverage: 1.0 },
                Position { asset: "USDC".into(), value_usd: 5000.0, leverage: 1.0 },
            ],
            nav_usd: 10000.0,
            cash_usd: 1000.0,
        }
    }

    fn test_constraints() -> ConstraintParams {
        ConstraintParams {
            max_drawdown_pct: 10.0,
            max_leverage: 2.0,
            max_concentration_pct: 50.0,
        }
    }

    #[test]
    fn test_simulate_returns_result() {
        let result = simulate(&test_portfolio(), &test_constraints(), &SimulationConfig {
            num_scenarios: 100,
            seed: Some(42),
            ..Default::default()
        });
        assert_eq!(result.scenarios_run, 100);
        assert!(result.failure_rate >= 0.0 && result.failure_rate <= 1.0);
    }

    #[test]
    fn test_simulate_with_seed_is_deterministic() {
        let config = SimulationConfig { num_scenarios: 50, seed: Some(123), ..Default::default() };
        let r1 = simulate(&test_portfolio(), &test_constraints(), &config);
        let r2 = simulate(&test_portfolio(), &test_constraints(), &config);
        assert_eq!(r1.passed, r2.passed);
        assert_eq!(r1.scenarios_run, r2.scenarios_run);
    }

    #[test]
    fn test_backtest_empty_returns_zeros() {
        let result = backtest(&[]);
        assert_eq!(result.total_return_pct, 0.0);
        assert_eq!(result.num_trades, 0);
    }

    #[test]
    fn test_backtest_positive_returns() {
        let returns = vec![0.01; 100]; // 1% daily for 100 days
        let result = backtest(&returns);
        assert!(result.total_return_pct > 0.0);
        assert_eq!(result.num_trades, 100);
        assert_eq!(result.profitable_trades, 100);
        assert!(result.sharpe_ratio > 0.0);
    }

    #[test]
    fn test_stress_test_negative_shock() {
        let result = stress_test(&test_portfolio(), &test_constraints(), -20.0);
        assert!(result.resulting_nav < test_portfolio().nav_usd);
        assert!(result.resulting_drawdown_pct > 0.0);
    }

    #[test]
    fn test_stress_test_breach_detection() {
        let result = stress_test(&test_portfolio(), &test_constraints(), -50.0);
        assert!(result.breaches_constraints);
        assert!(result.recovery_days.is_some());
    }

    #[test]
    fn test_feasibility_conservative_target() {
        let band = compute_feasibility_band("multiple", 1.2, 365, 5.0);
        assert!(band.feasible);
        assert!(band.negotiation_prompt.is_none());
    }

    #[test]
    fn test_feasibility_aggressive_target() {
        let band = compute_feasibility_band("multiple", 5.0, 70, 5.0);
        assert!(!band.feasible);
        assert!(band.negotiation_prompt.is_some());
    }

    #[test]
    fn test_feasibility_band_values() {
        let band = compute_feasibility_band("multiple", 3.0, 180, 10.0);
        assert!(band.min_historical_drawdown_pct > 0.0);
        assert!(band.max_historical_drawdown_pct > band.min_historical_drawdown_pct);
    }
}
