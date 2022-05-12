/// <reference types="@nomiclabs/hardhat-waffle" />

import "@nomiclabs/hardhat-ethers";

import { task } from "hardhat/config";
import { tree } from "wallets";

import { MeLegendGen1 } from "../artifacts/types";
import { MeLegendGen1__factory } from "../artifacts/types/factories/MeLegendGen1__factory";

interface DeployParams {
  genesis: string;
}

task("state:presale", "enables presale", async (taskArgs: DeployParams, hre) => {
  const [owner] = await hre.ethers.getSigners();

  const Melegend = (await hre.ethers.getContractFactory("MeLegendGen1", owner)) as MeLegendGen1__factory;
  const nft = Melegend.attach(process.env.ME_LEGEND_GEN1_ADDRESS as string).connect(owner) as MeLegendGen1;

  const data = await nft.enablePresale(tree.getHexRoot());
  await data.wait(1);

  console.info("Done!");
});

task("state:public", "enables presale", async (taskArgs: DeployParams, hre) => {
  const [owner] = await hre.ethers.getSigners();

  const Melegend = (await hre.ethers.getContractFactory("MeLegendGen1", owner)) as MeLegendGen1__factory;
  const nft = Melegend.attach(process.env.ME_LEGEND_GEN1_ADDRESS as string).connect(owner) as MeLegendGen1;

  const data = await nft.enablePublic();
  await data.wait(1);

  console.info("Done!");
});

task("state:claming", "enables presale", async (taskArgs: DeployParams, hre) => {
  const [owner] = await hre.ethers.getSigners();

  const Melegend = (await hre.ethers.getContractFactory("MeLegendGen1", owner)) as MeLegendGen1__factory;
  const nft = Melegend.attach(process.env.ME_LEGEND_GEN1_ADDRESS as string).connect(owner) as MeLegendGen1;

  const data = await nft.enableClaiming();
  await data.wait(1);

  console.info("Done!");
});
