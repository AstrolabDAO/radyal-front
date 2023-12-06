import { useContext, useMemo } from "react";
import { TokensContext } from "~/context/tokens-context";
import SelectToken from "../SelectToken";
import { tokenBySlug } from "~/utils/mappings";
import { SwapContext } from "~/context/swap-context";
import { SwapModalContext } from "~/context/swap-modal-context";
import { BaseModalProps } from "../Modal";

export enum SelectTokenModalMode {
  Deposit = "deposit",
  Withdraw = "withdraw",
}
interface SelectTokenModalProps extends BaseModalProps {
  mode: SelectTokenModalMode;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const SelectTokenModal = ({ mode }: SelectTokenModalProps) => {
  const { sortedBalances } = useContext(TokensContext);
  const { selectFromToken, switchSelectMode } = useContext(SwapContext);
  const { tokens } = useContext(TokensContext);
  const { closeModal } = useContext(SwapModalContext);

  const tokensList = useMemo(() => {
    return mode === SelectTokenModalMode.Deposit
      ? sortedBalances
          .filter((balance) => {
            const token = tokenBySlug[balance.slug];
            if (!token) return false;
            return true;
          })
          .map((balance) => tokenBySlug[balance.slug])
      : tokens;
  }, [mode, sortedBalances, tokens]);
  return (
    <div className="p-4">
      <div className="select-token block">
        <div className="box w-full">
          <SelectToken
            tokens={tokensList}
            onSelect={(token) => {
              if (mode === SelectTokenModalMode.Deposit) {
                selectFromToken(token);
              } else {
                SelectToken(token);
              }
              switchSelectMode();
              closeModal();
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default SelectTokenModal;
