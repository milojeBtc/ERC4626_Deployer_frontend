const API_URL = "http://localhost:5000/";
const CONTRACT_ADDRESS = "0xB9e09e1447e25E10A9fC35cD26510bCcE613aF57";
const TOKEN_VAULT_FACTORY_ADDRESS =
  "0x779392f4fdFBB220e9Eb91e6576B52Ac9Cd1a718";
const RPC_URL = "https://sepolia.base.org";

const baseChainId = "0x14a34"; // Hexadecimal for 8453 (Base Mainnet Chain ID)

const baseChainParams = {
  chainId: "0x14a34",
  chainName: "Base Sepolia",
  nativeCurrency: {
    name: "Base",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://sepolia.base.org"], // Base mainnet RPC URL
  blockExplorerUrls: ["https://sepolia.basescan.org"],
};

export {
  API_URL,
  CONTRACT_ADDRESS,
  RPC_URL,
  baseChainId,
  baseChainParams,
  TOKEN_VAULT_FACTORY_ADDRESS,
};
