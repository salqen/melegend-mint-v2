const envconfig = {
  // Network
  NETWORK: parseInt(process.env.NETWORK || "1") || 1,

  // Infura
  INFURA_KEY: process.env.INFURA_KEY || "",

  INFURA_IPFS_NODE: process.env.INFURA_IPFS_NODE || "",
  INFURA_IPFS_GATEWAY: process.env.INFURA_IPFS_GATEWAY || "",
  INFURA_IPFS_PUBLIC_KEY: process.env.INFURA_IPFS_PUBLIC_KEY || "",
  INFURA_IPFS_SECRET_KEY: process.env.INFURA_IPFS_SECRET_KEY || "",

  // Contracts
  ME_LEGEND_GEN1_ADDRESS: process.env.ME_LEGEND_GEN1_ADDRESS || "",
  ME_LEGEND_GENESIS_ADDRESS: process.env.ME_LEGEND_GENESIS_ADDRESS || "",
};

export default envconfig;
