import { erc20Abi } from "abitype/abis";
import { useCallback, useContext } from "react";

import { useChainId, useReadContract } from "wagmi";
import { switchChain } from "wagmi/actions";
import { BaseTxArgs, TxArgs, approve } from "~/services/transaction";
import { getWagmiConfig } from "~/services/web3";
import { Token } from "~/utils/interfaces";

export const useSwitchNetwork = (chainId: number) => {
  const currentNetwork = useChainId();
  return useCallback(async () => {
    if (currentNetwork !== chainId) switchChain(getWagmiConfig(), { chainId });
  }, [chainId, currentNetwork]);
};

export const useReadTx = ({
  functionName,
  address,
  args,
  chainId,
  abi = erc20Abi,
}: TxArgs) => {
  return useReadContract({
    address,
    chainId,
    abi,
    args: args as any,
    functionName,
  }).data;
};

export const useAllowance = (allowanceOpts: BaseTxArgs) => {
  return useReadTx({
    functionName: "allowance",
    ...allowanceOpts,
  });
};

export const useApprove = (token: Token) => {
  return useCallback(
    async ({ spender, amount }: ApproveArgs) => {
      return approve({
        spender,
        amount,
        address: token.address,
        chainId: token.network.id,
      });
    },
    [token]
  );
};

interface ApproveArgs {
  spender: `0x${string}`;
  amount: bigint;
}
