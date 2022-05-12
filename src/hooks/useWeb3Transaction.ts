// import { fetchToken } from "lib/api/tokens";
import { BigNumber } from "@ethersproject/bignumber";
import { BaseContract, ContractReceipt, ContractTransaction } from "@ethersproject/contracts";
import { Provider, Web3Provider } from "@ethersproject/providers";
import { parseEther } from "@ethersproject/units";
import type { MeLegendGen1 } from "artifacts/types";
import { MeLegendGen1__factory } from "artifacts/types/factories/MeLegendGen1__factory";
import env from "lib/env";
import create from "zustand";

export { MeLegendGen1, MeLegendGen1__factory as MeLegendGen1Factory };

export enum Step {
  None = "none",
  ConnectWallet = "connect",
  Confirmation = "confirm",
  Send = "send",
  Sucess = "success",
  Error = "error",
}

export interface Description {
  action: string;
  description: string;
  value: BigNumber;
}

export type UpdateType = "Open" | "WalletConnected" | "BeforeSign" | "AfterSign" | "Done" | "Close";

export interface TransactionParams<F> {
  factory: F;
  fn: string;
  description: Description;
  args: any;
  update?: (t: UpdateType) => void;
}

export interface State {
  open: boolean;
  step: Step;
  provider?: Provider;
  error?: Error;
  hash?: string;
  gasUsed?: BigNumber;
  params?: TransactionParams<any>;
  presaleMint: (address: string, amount: number) => Promise<void>;
  publicMint: (amount: number) => Promise<void>;
  claimMint: () => Promise<void>;
  makeTransaction: <T>(params: TransactionParams<T>) => void;
  close: () => void;
  connectWallet: (provider: Provider) => void;
  confirmed: () => Promise<void>;
}

const PRICE = parseEther("0.1");

export const useWeb3TransactionPresenter = create<State>((set, get) => ({
  open: false,
  step: Step.None,

  async presaleMint(address: string, amount: number) {
    const { makeTransaction } = get();

    const data = await fetch("/api/presale?address=" + address, {
      method: "GET",
    });

    const json = await data.json();
    console.log(json);

    await makeTransaction({
      description: {
        action: "Mint",
        description: "Mint",
        value: PRICE.mul(amount),
      },
      factory: MeLegendGen1__factory,
      fn: "presaleMint",
      args: [
        BigNumber.from(amount),
        json.proof,
        {
          value: PRICE.mul(amount),
        },
      ],
    });
  },

  async publicMint(amount: number) {
    const { makeTransaction } = get();

    await makeTransaction({
      description: {
        action: "Mint",
        description: "Mint",
        value: PRICE.mul(amount),
      },
      factory: MeLegendGen1__factory,
      fn: "publicMint",
      args: [
        BigNumber.from(amount),
        {
          value: PRICE.mul(amount),
        },
      ],
    });
  },

  async claimMint() {
    const { makeTransaction } = get();

    await makeTransaction({
      description: {
        action: "Mint",
        description: "Claiming",
        value: parseEther("0.0"),
      },
      factory: MeLegendGen1__factory,
      fn: "claimMint",
      args: [],
    });
  },

  makeTransaction(params) {
    set({
      open: true,
      params,
      step: Step.ConnectWallet,
    });
    params.update?.("Open");
  },

  connectWallet(provider: Provider) {
    const { params } = get();
    params?.update?.("WalletConnected");
    set({ step: Step.Confirmation, provider });
  },

  async confirmed() {
    set({ step: Step.Send });

    const params = get().params as TransactionParams<any>;
    params.update?.("BeforeSign");
    const provider = get().provider as Web3Provider;

    const contract = params.factory.connect(env.ME_LEGEND_GEN1_ADDRESS, provider.getSigner()) as BaseContract;
    const fn = (contract as any)[params.fn];

    let result: ContractTransaction;
    let reci: ContractReceipt;
    try {
      console.info("calling: ", params.fn, ...params.args);
      result = await fn(...params.args);
      params.update?.("AfterSign");
      reci = await result.wait(1);
      params.update?.("Done");
    } catch (e) {
      console.error(e);
      return set({
        step: Step.Error,
        error: e,
      });
    }

    set({
      step: reci.status === 1 ? Step.Sucess : Step.Error,
      hash: reci.transactionHash,
      gasUsed: reci.gasUsed,
    });
  },

  close() {
    const { params, step } = get();
    if (step === Step.Send) {
      return;
    }
    params?.update?.("Close");
    set({
      open: false,
      step: Step.None,
      params: undefined,
      provider: undefined,
      error: undefined,
      hash: undefined,
    });
  },
}));
