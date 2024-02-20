import { erc20Abi } from "abitype/abis";
import { useCallback } from "react";
import { useAccount, useContractRead } from "wagmi";
import { switchNetwork } from "wagmi/actions";
import { BaseTxArgs, TxArgs, approve } from "~/services/transaction";
import { Token } from "~/utils/interfaces";
import { WAGMI_CONFIG } from "~/utils/setup-web3modal";

export const useSwitchNetwork = (chainId: number) => {
  const currentNetwork = useAccount(WAGMI_CONFIG as any).chain;
  return useCallback(async () => {
    if (currentNetwork.id !== chainId) switchNetwork(WAGMI_CONFIG, { chainId });
  }, [chainId, currentNetwork.id]);
};

export const useReadTx = ({
  functionName,
  address,
  args,
  chainId,
  abi = erc20Abi,
  enabled = true,
}: TxArgs) => {
  return useContractRead({
    address,
    chainId,
    abi,
    args: args as any,
    functionName,
    // enabled,
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
