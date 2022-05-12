const envconfig = {
  NETWORK: parseInt(process.env.NEXT_PUBLIC_NETWORK || "1") || 1,
  INFURA_KEY: process.env.NEXT_PUBLIC_INFURA_KEY || "",
  ME_LEGEND_GEN1_ADDRESS: process.env.NEXT_PUBLIC_ME_LEGEND_GEN1_ADDRESS || "",
  ME_LEGEND_GENESIS_ADDRESS: process.env.NEXT_PUBLIC_ME_LEGEND_GENESIS_ADDRESS || "",
};

if (typeof window !== "undefined") {
  (<any>window).envvars = envconfig;
}

export default envconfig;
