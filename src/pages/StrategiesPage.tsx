import StrategyGrid from "~/components/strategy/StrategyGrid";
import StrategyHero from "~/components/strategy/StrategyHero";

import { useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { useAccount } from "wagmi";
import { ONE_MINUTE } from "~/main";
import { getStrategies } from "~/utils/api";
import { Balance, Strategy } from "~/utils/interfaces";

import { useDispatch } from "react-redux";
import { useTokensStore } from "~/hooks/tokens";
import { getStrategiesBalances } from "~/services/strategies";

import { init } from "~/store/strategies";
import { addBalances, addTokens } from "~/store/tokens";
import { cacheHash } from "~/utils/format";
import Layout from "~/components/layout/Layout";
const StrategiesPage = () => {
  const { address, isConnected } = useAccount();

  const dispatch = useDispatch();

  const tokensStore = useTokensStore();

  const { data: strategies, isLoading: strategiesIsLoading } = useQuery<
    Strategy[]
  >("strategies", getStrategies, {
    enabled: tokensStore.tokenLoaded,
    staleTime: ONE_MINUTE * 5,
  });

  const enabled = useMemo(() => {
    return strategies?.length > 0 && isConnected;
  }, [isConnected, strategies]);

  const { data: balances, isLoading: balancesIsLoading } = useQuery<Balance[]>(
    cacheHash("strategiesBalances", address),
    async () => getStrategiesBalances(address, strategies),
    {
      enabled,
      staleTime: ONE_MINUTE,
      refetchInterval: ONE_MINUTE,
    }
  );

  useEffect(() => {
    if (strategiesIsLoading || !strategies) return;
    dispatch(
      init({
        strategies,
      })
    );
    dispatch(addTokens(strategies));
  }, [strategies, dispatch, strategiesIsLoading]);

  useEffect(() => {
    if (balancesIsLoading || !balances) return;
    dispatch(addBalances(balances));
  }, [balancesIsLoading, balances, dispatch]);

  return (
    <Layout>
      <StrategyHero />
      <StrategyGrid />
    </Layout>
  );
};
export default StrategiesPage;
