import { useMemo } from "react";

import { useInteraction } from "~/hooks/swapper";
import { useBalances, useTokenBySlug, useTokens } from "~/hooks/tokens";

import { Token } from "~/utils/interfaces";

import { closeModal } from "~/services/modal";
import { selectToken, switchSelection } from "~/services/swapper";
import SelectToken from "../select-token/SelectToken";
import { ActionInteraction } from "~/store/swapper";

const SelectTokenModal = () => {
  const tokens = useTokens();

  const balances = useBalances();
  const interaction = useInteraction();
  const tokenBySlug = useTokenBySlug();
  const tokensList = useMemo(() => {
    return interaction === ActionInteraction.DEPOSIT
      ? balances
          .filter((balance) => {
            const token = tokenBySlug[balance.token];
            return !!token;
          })
          .map((balance) => tokenBySlug[balance.token])
      : tokens;
  }, [balances, interaction, tokenBySlug, tokens]);

  return (
    <div>
      <SelectToken
        onBackClick={() => closeModal()}
        tokens={tokensList}
        onSelect={(token: Token) => {
          selectToken({
            token,
            for: interaction === ActionInteraction.DEPOSIT ? "from" : "to",
          });
          switchSelection();
          closeModal();
        }}
      />
    </div>
  );
};
export default SelectTokenModal;
