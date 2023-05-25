const networks = {
    ethereumla: {
    name: "ethereum",
    rpcUrl: "https://mainnet.infura.io/v3/fb42577745e24d429d936f65b43cca0b",
    chainId: 1,
    explorer: "https://etherscan.io",
  },
  goerli: {
    name: "goerli",
    rpcUrl: "https://goerli.infura.io/v3/fb42577745e24d429d936f65b43cca0b",
    chainId: 5,
    explorer: "https://goerli.etherscan.io",
  },
  sepolia: {
    name: "sepolia",
    rpcUrl: "https://sepolia.infura.io/v3/fb42577745e24d429d936f65b43cca0b",
    chainId: 159,
    explorer: "https://ropsten.etherscan.io",
  },
};

export default networks;
