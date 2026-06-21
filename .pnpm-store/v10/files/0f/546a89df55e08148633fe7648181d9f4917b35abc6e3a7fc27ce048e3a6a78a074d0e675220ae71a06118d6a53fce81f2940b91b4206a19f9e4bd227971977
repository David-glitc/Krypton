'use client'
const isSupportedNetwork = ({ walletConnector, network }) => {
    const enabledNetworks = walletConnector.getEnabledNetworks();
    // If no networks are configured, all networks are supported
    if (!enabledNetworks.length) {
        return true;
    }
    // If network is undefined, the connector hasn't determined the network yet
    // This can happen during initial load before getNetwork() resolves
    if (network === undefined) {
        return false;
    }
    // Check if network matches either chainId or networkId
    // This supports chains like Stellar where getNetwork() returns the chainId hash
    const isCurrentNetworkSupported = enabledNetworks.some(({ chainId, networkId }) => String(chainId) === String(network) ||
        String(networkId) === String(network));
    return isCurrentNetworkSupported;
};

export { isSupportedNetwork };
