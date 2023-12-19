import { ITransactionRequestWithEstimate } from "@astrolabs/swapper";
import { Token } from "~/utils/interfaces";
import { approve } from "~/utils/web3";
import { PublicClient } from "wagmi";
import { swap } from "./strategy";

export const executeSwap = (
  { route, allowance, routerAddress, fromToken, amount }: ExecuteSwapProps,
  publicClient: PublicClient
) => {
  if (allowance !== null && amount > allowance) {
    return [
      route,
      approve(routerAddress, amount.toString(), fromToken.address).then(
        async ({ hash }) => {
          await publicClient.waitForTransactionReceipt({
            hash,
          });
          return swap(route);
        }
      ),
    ];
  }
  return [route, swap(route)];
};

interface ExecuteSwapProps {
  route: ITransactionRequestWithEstimate;
  allowance: bigint | null;
  routerAddress: `0x${string}`;
  fromToken: Token;
  amount: bigint;
}
