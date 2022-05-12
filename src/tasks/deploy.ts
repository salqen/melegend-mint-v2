/// <reference types="@nomiclabs/hardhat-waffle" />

import "@nomiclabs/hardhat-ethers";

import { task, types } from "hardhat/config";

import { MeLegendGen1__factory } from "../artifacts/types/factories/MeLegendGen1__factory";
import { MeLegendGenesis__factory } from "../artifacts/types/factories/MeLegendGenesis__factory";

interface DeployParams {
  genesis: string;
}

task("deploy:gen1", "deploys the gen1 nft", async (taskArgs: DeployParams, hre) => {
  const [owner] = await hre.ethers.getSigners();

  const genFactory = (await hre.ethers.getContractFactory("MeLegendGen1", owner)) as MeLegendGen1__factory;
  const gen = await genFactory.deploy(taskArgs.genesis);

  await gen.deployed();

  console.info("Done!", gen.address);
}).addParam("genesis", "genesis address", "", types.string);

task("deploy:genesis", "deploys the genesis nft", async (taskArgs, hre) => {
  const [owner] = await hre.ethers.getSigners();

  const genesisFactory = (await hre.ethers.getContractFactory("MeLegendGenesis", owner)) as MeLegendGenesis__factory;
  const genesis = await genesisFactory.deploy();

  await genesis.deployed();
  console.info("Done!", genesis.address);
});
