import { useMemo } from "react";
import { useCloseModal } from "~/hooks/store/modal";
import { useSelectToken, useSwitchSelection } from "~/hooks/store/swapper";
import { useBalances, useTokenBySlug, useTokens } from "~/hooks/store/tokens";
import { SelectTokenModalMode } from "~/utils/constants";
import { Token } from "~/utils/interfaces";
import { BaseModalProps } from "../Modal";
import SelectToken from "../SelectToken";

interface SelectTokenModalProps extends BaseModalProps {
  mode: SelectTokenModalMode;
}

const SelectTokenModal = ({ mode }: SelectTokenModalProps) => {
  const switchSelectMode = useSwitchSelection();
  const selectToken = useSelectToken();
  const tokens = useTokens();
  const closeModal = useCloseModal();
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
    <div className="p-4 bg-dark-800 max-h-screen">
      <SelectToken
        onBackClick={() => closeModal()}
        tokens={tokensList}
        onSelect={(token: Token) => {
          selectToken({
            token,
            for: mode === SelectTokenModalMode.Deposit ? "from" : "to",
          });
          switchSelectMode();
          closeModal();
        }}
      />
    </div>
  );
};
export default SelectTokenModal;
