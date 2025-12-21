import {patchState, signalStoreFeature, withMethods, withState} from '@ngrx/signals';

export function withSelectState() {
  return signalStoreFeature(
    withState({
      selectLoading: false,
      selectError: null as string | null,
    }),
    withMethods((store) => ({
      setSelectLoading: () => patchState(store, { selectLoading: true, selectError: null }),
      setSelectLoaded: () => patchState(store, { selectLoading: false, selectError: null }),
      setSelectError: (selectError: string) => patchState(store, { selectLoading: false, selectError }),
    }))
  );
}
