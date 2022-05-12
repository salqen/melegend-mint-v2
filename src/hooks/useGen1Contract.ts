import { Provider } from "@ethersproject/providers";
import { MeLegendGen1, MeLegendGen1__factory } from "artifacts/types";
import env from "lib/env";
import { useEffect, useState } from "react";

import { Web3 } from "./useWeb3";

export type IContractResp<T> = {
  contract?: T;
  error?: Error;
  connected: boolean;
  loading: boolean;
  state: number;
  maxSupply: number;
  totalSupply: number;
};

const initial = {
  state: 0,
  maxSupply: 0,
  totalSupply: 0,
};

export function useGen1Contract(web3: Web3): IContractResp<MeLegendGen1> {
  const [contracts, setContracts] = useState<IContractResp<MeLegendGen1>>({
    connected: false,
    loading: false,
    ...initial,
  });

  useEffect(() => {
    if (web3.error) {
      return setContracts({
        connected: false,
        error: web3.error,
        loading: false,
        ...initial,
      });
    }

    if (!web3.connected) {
      return setContracts({
        connected: false,
        error: web3.error,
        loading: web3.activating,
        ...initial,
      });
    }

    setContracts({
      connected: false,
      loading: true,
      ...initial,
    });

    const factory = MeLegendGen1__factory.connect(env.ME_LEGEND_GEN1_ADDRESS, web3.provider as Provider);

    setContracts({
      connected: true,
      contract: factory,
      loading: false,
      ...initial,
    });

    const promise = Promise.all([factory.totalSupply(), factory.maxSupply(), factory.state()]);

    promise.then(([totalSupply, maxSupply, state]) => {
      setContracts({
        connected: true,
        contract: factory,
        loading: false,
        state: state,
        totalSupply: totalSupply.toNumber(),
        maxSupply: maxSupply.toNumber(),
      });
    });

    return () => {
      if (contracts.contract) {
        contracts.contract.removeAllListeners();
      }
    };
  }, [web3]);

  return contracts;
}
