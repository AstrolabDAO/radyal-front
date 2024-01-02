import { erc20Abi } from "abitype/abis";
import { useCallback } from "react";
import { useContractRead, useNetwork } from "wagmi";
import { switchNetwork } from "wagmi/actions";
import { BaseTxArgs, TxArgs, approve } from "~/services/transaction";
import { Token } from "~/utils/interfaces";

export const useSwitchNetwork = (chainId: number) => {
  const currentNetwork = useNetwork();
  return useCallback(async () => {
    if (currentNetwork.chain.id !== chainId) switchNetwork({ chainId });
  }, [chainId, currentNetwork.chain.id]);
};

export const useReadTx = ({
  functionName,
  address,
  args,
  chainId,
  abi = erc20Abi,
}: TxArgs) => {
  return useContractRead({
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
