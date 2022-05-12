import { isAddress } from "@ethersproject/address";
import { keccak256 } from "@ethersproject/keccak256";
import { MerkleTree } from "merkletreejs";

import wallets from "./wallets.json";

const notValid = wallets.filter((e) => !isAddress(e));

if (notValid.length > 0) {
  throw new Error(notValid.join("\n") + " are not valid eth wallets");
}

const allWallets = wallets.map((e) => e.toLocaleLowerCase());
const leaves = allWallets.map((x) => keccak256(x));
const tree = new MerkleTree(leaves, keccak256, { sort: true });

const root = tree.getHexRoot();
console.info("root is", root, " from ", wallets.length);

export { root, tree, allWallets as wallets };
