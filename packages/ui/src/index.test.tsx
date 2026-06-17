import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { PolicyBlock, PipelineStrip, ConstraintBars, PendingActionCard } from './index'

afterEach(() => cleanup())

describe('PolicyBlock', () => {
  it('renders all fields from a Record', () => {
    const fields = { action: 'buy', asset: 'SOL/USDC', amount: '1000' }
    render(<PolicyBlock fields={fields} />)
    // The component renders "<key>:" in an accent span, then the value in a primary span
    expect(screen.getByText('action:')).toBeInTheDocument()
    expect(screen.getByText('buy')).toBeInTheDocument()
    expect(screen.getByText('asset:')).toBeInTheDocument()
    expect(screen.getByText('SOL/USDC')).toBeInTheDocument()
    expect(screen.getByText('amount:')).toBeInTheDocument()
    expect(screen.getByText('1000')).toBeInTheDocument()
  })
})

describe('PipelineStrip', () => {
  it('renders all 5 pipeline nodes in order', () => {
    render(<PipelineStrip />)
    expect(screen.getByText('policy')).toBeInTheDocument()
    expect(screen.getByText('agents')).toBeInTheDocument()
    expect(screen.getByText('constraints')).toBeInTheDocument()
    expect(screen.getByText('ika_signing')).toBeInTheDocument()
    expect(screen.getByText('vault')).toBeInTheDocument()
  })
})

describe('ConstraintBars', () => {
  const minValues = {
    drawdown: { current: 0, max: 0 },
    leverage: { current: 0, max: 0 },
    concentration: { current: 0, max: 0 },
  }

  const normalValues = {
    drawdown: { current: 10, max: 20 },
    leverage: { current: 150, max: 300 },
    concentration: { current: 8, max: 25 },
  }

  it('renders without crashing with minimum (zero) values', () => {
    render(<ConstraintBars {...minValues} />)
    expect(screen.getByText('drawdown')).toBeInTheDocument()
    expect(screen.getByText('leverage')).toBeInTheDocument()
    expect(screen.getByText('0x / 0x')).toBeInTheDocument()
    expect(screen.getByText('concentration')).toBeInTheDocument()
    // drawdown and concentration both show "0% / 0%" — use getAllByText
    const pctBars = screen.getAllByText('0% / 0%')
    expect(pctBars).toHaveLength(2)
  })

  it('renders correct formatted values at normal levels', () => {
    render(<ConstraintBars {...normalValues} />)
    expect(screen.getByText('10% / 20%')).toBeInTheDocument()
    expect(screen.getByText('1.5x / 3x')).toBeInTheDocument()
    expect(screen.getByText('8% / 25%')).toBeInTheDocument()
  })
})

describe('PendingActionCard', () => {
  const sampleAction = {
    id: 'act-1',
    actionType: 'swap',
    rationale: 'Adjust SOL exposure',
    expectedReturnPct: 2.5,
    expectedDrawdownPct: 5.0,
    var95Pct: 3.2,
    compositeScore: 0.78,
    postLeverageBps: 150,
    postConcentrationBps: 1200,
  }

  it('renders action type and composite score', () => {
    render(<PendingActionCard action={sampleAction} />)
    expect(screen.getByText('swap')).toBeInTheDocument()
    expect(screen.getByText(/score 78/)).toBeInTheDocument()
  })

  it('renders expected metrics', () => {
    render(<PendingActionCard action={sampleAction} />)
    // expected_return shows 2.5%, expected_drawdown shows 5.0%, var_95 shows 3.2%
    // Each value appears in the grid (one per metric label). Use getAllByText for duplicate-safe assertions.
    const returnValues = screen.getAllByText('2.5%')
    expect(returnValues.length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('5.0%').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('3.2%').length).toBeGreaterThanOrEqual(1)
  })

  it('renders post-execution values', () => {
    render(<PendingActionCard action={sampleAction} />)
    const content = screen.getByText(/post_execution/)
    expect(content).toBeInTheDocument()
    expect(content.textContent).toContain('1.50x')
    expect(content.textContent).toContain('12.0%')
  })

  it('calls onApprove when approve button is clicked', () => {
    const onApprove = vi.fn()
    render(<PendingActionCard action={sampleAction} onApprove={onApprove} />)
    fireEvent.click(screen.getByText('Approve & sign'))
    expect(onApprove).toHaveBeenCalledTimes(1)
  })

  it('calls onReject when reject button is clicked', () => {
    const onReject = vi.fn()
    render(<PendingActionCard action={sampleAction} onReject={onReject} />)
    fireEvent.click(screen.getByText('Reject'))
    expect(onReject).toHaveBeenCalledTimes(1)
  })

  it('does not render action buttons when no callbacks provided', () => {
    render(<PendingActionCard action={sampleAction} />)
    expect(screen.queryByText('Approve & sign')).not.toBeInTheDocument()
    expect(screen.queryByText('Reject')).not.toBeInTheDocument()
  })
})