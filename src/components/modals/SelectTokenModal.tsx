import { useMemo } from "react";

import { useInteraction } from "~/hooks/swapper";
import { useBalances, useTokenBySlug, useTokens } from "~/hooks/tokens";

import { Token } from "~/utils/interfaces";
import { SelectTokenModalMode, StrategyInteraction } from "~/utils/constants";

import { BaseModalProps } from "../Modal";
import SelectToken from "../select-token/SelectToken";
import { closeModal } from "~/services/modal";
import { selectToken, switchSelection } from "~/services/swapper";

interface SelectTokenModalProps extends BaseModalProps {
  mode: SelectTokenModalMode;
}

const SelectTokenModal = () => {
  const tokens = useTokens();

  const balances = useBalances();
  const interaction = useInteraction();
  const tokenBySlug = useTokenBySlug();
  const tokensList = useMemo(() => {
    return interaction === StrategyInteraction.DEPOSIT
      ? balances
          .filter((balance) => {
            const token = tokenBySlug[balance.token];
            return !!token;
          })
          .map((balance) => tokenBySlug[balance.token])
      : tokens;
  }, [balances, interaction, tokenBySlug, tokens]);

  return (
    <div className="modal-wrapper">
      <SelectToken
        onBackClick={() => closeModal()}
        tokens={tokensList}
        onSelect={(token: Token) => {
          selectToken({
            token,
            for: interaction === StrategyInteraction.DEPOSIT ? "from" : "to",
          });
          switchSelection();
          closeModal();
        }}
      />
    </div>
  );
};
export default SelectTokenModal;
