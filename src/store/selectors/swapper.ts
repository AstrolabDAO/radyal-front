import { createSelector } from "@reduxjs/toolkit";
import { IRootState } from "..";
import { tokensIsEqual } from "~/utils";

export const estimationIsEnabledSelector = createSelector(
  (state: IRootState) => state.swapper,
  (state) => {
    const interaction = state.interaction;
    const action = state[interaction];

    return !!(
      !state.is.estimationOnprogress &&
      action.from &&
      action.value > 0 &&
      action.to &&
      !state.is.estimationLocked &&
      !state.is.onWrite
    );
  }
);

export const interactionNeedToSwapSelector = createSelector(
  (state: IRootState) => state.swapper,
  (state) => {
    const interaction = state.interaction;
    const action = state[interaction];

    if (!action.from || !action?.to) return false;

    return !tokensIsEqual(action.from, action.to);
  }
);

export const canSwapSelector = createSelector(
  (state: IRootState) => state.swapper,
  (state) => {
    const interaction = state.interaction;
    const estimatedRoute = state[interaction].estimatedRoute;

    return !!(
      !state.is.estimationOnprogress &&
      estimatedRoute &&
      !estimatedRoute?.error &&
      !state.is.locked
    );
  }
);

export const needApproveSelector = createSelector(
  (state: IRootState) => state.swapper,
  (state) => {
    const interaction = state.interaction;
    const action = state[interaction];
    const estimation = action.estimatedRoute;
    if (!estimation) return false;
    return estimation?.steps?.[0]?.type === "Approve";
  }
);
