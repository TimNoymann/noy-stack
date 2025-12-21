import {patchState, signalStoreFeature, withMethods, withState} from '@ngrx/signals';

export function withSavingState() {
  return signalStoreFeature(
    withState({
      saveLoading: false,
      saveError: null as string | null,
    }),
    withMethods((store) => ({
      setSaveLoading: () => patchState(store, { saveLoading: true, saveError: null }),
      setSaveLoaded: () => patchState(store, { saveLoading: false, saveError: null }),
      setSaveError: (saveError: string) => patchState(store, { saveLoading: false, saveError }),
    }))
  );
}
