import { useContext, useMemo } from "react";
import { SwapContext } from "~/context/swap-context";
import { SwapModalContext } from "~/context/swap-modal-context";
import { useBalances, useTokenBySlug, useTokens } from "~/hooks/store/tokens";
import { SelectTokenModalMode } from "~/utils/constants";
import { BaseModalProps } from "../Modal";
import SelectToken from "../SelectToken";

interface SelectTokenModalProps extends BaseModalProps {
  mode: SelectTokenModalMode;
}

const SelectTokenModal = ({ mode }: SelectTokenModalProps) => {
  const { selectFromToken, switchSelectMode, selectToToken } =
    useContext(SwapContext);
  const tokens = useTokens();
  const { closeModal } = useContext(SwapModalContext);

  const balances = useBalances();

  const tokenBySlug = useTokenBySlug();
  const tokensList = useMemo(() => {
    return mode === SelectTokenModalMode.Deposit
      ? balances
          .filter((balance) => {
            const token = tokenBySlug[balance.token];
            return !!token;
          })
          .map((balance) => tokenBySlug[balance.token])
      : tokens;
  }, [balances, mode, tokenBySlug, tokens]);

  return (
    <div className="p-4 bg-dark max-h-screen">
      <SelectToken
        tokens={tokensList}
        onSelect={(token) => {
          if (mode === SelectTokenModalMode.Deposit) {
            selectFromToken(token);
          } else {
            selectToToken(token);
          }
          switchSelectMode();
          closeModal();
        }}
      />
    </div>
  );
};
export default SelectTokenModal;
