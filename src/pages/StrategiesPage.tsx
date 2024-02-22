import StrategyGrid from "~/components/strategy/StrategyGrid";
import StrategyHero from "~/components/strategy/StrategyHero";

import { useEffect, useMemo } from "react";

import { useAccount } from "wagmi";

import { Balance, Strategy } from "~/utils/interfaces";

import { useDispatch } from "react-redux";
import { useTokensStore } from "~/hooks/tokens";
import { getStrategiesBalances } from "~/services/strategies";

import { useQuery } from "@tanstack/react-query";
import { ONE_MINUTE } from "~/App";
import Layout from "~/components/layout/Layout";
import { useProtocolsIsLoading } from "~/hooks/web3";
import { init } from "~/store/strategies";
import { addBalances, addTokens } from "~/store/tokens";
import { getStrategies } from "~/utils/api";
import { cacheHash } from "~/utils/format";
const StrategiesPage = () => {
  const { address, isConnected } = useAccount();

  const dispatch = useDispatch();

  const tokensStore = useTokensStore();
  const protocolsIsLoading = useProtocolsIsLoading();

  const { data: strategies, isLoading: strategiesIsLoading } = useQuery({
    queryKey: ["strategies"],
    queryFn: getStrategies,
    enabled: !protocolsIsLoading && tokensStore.tokenLoaded,
    staleTime: ONE_MINUTE * 5,
  });

  const enabled = useMemo(() => {
    return strategies?.length > 0 && isConnected;
  }, [isConnected, strategies]);

  const { data: balances, isLoading: balancesIsLoading } = useQuery<Balance[]>({
    queryKey: [cacheHash("strategiesBalances", address)],
    queryFn: () => getStrategiesBalances(address, strategies),
    enabled,
    staleTime: ONE_MINUTE,
    refetchInterval: ONE_MINUTE,
  });

  useEffect(() => {
    if (strategiesIsLoading || !strategies) return;

    dispatch(
      init({
        strategies: strategies.map((strategy) => new Strategy(strategy)),
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
