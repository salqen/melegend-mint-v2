// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { isAddress } from "@ethersproject/address";
import { keccak256 } from "@ethersproject/keccak256";
import assert from "assert";
import type { NextApiRequest, NextApiResponse } from "next";
import { tree, wallets } from "wallets";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.query.address) {
      throw new Error("Not a right ETH address");
    }

    assert(typeof req.query.address === "string");

    if (!isAddress(req.query.address as string)) {
      throw new Error("Not a right ETH address");
    }
    const addr = req.query.address.toLowerCase();

    if (!wallets.includes(addr)) {
      throw new Error("Not included in presale");
    }
    const leaf = keccak256(addr);
    const proof = tree.getHexProof(leaf);

    res.status(200).json({ proof });
  } catch (e) {
    res.status(400).json({ message: e?.message });
  }
}
