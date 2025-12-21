import {patchState, signalStoreFeature, withMethods, withState} from '@ngrx/signals';

export function withDeleteState() {
  return signalStoreFeature(
    withState({
      deleteLoading: false,
      deleteError: null as string | null,
    }),
    withMethods((store) => ({
      setDeleteLoading: () => patchState(store, { deleteLoading: true, deleteError: null }),
      setDeleteLoaded: () => patchState(store, { deleteLoading: false, deleteError: null }),
      setDeleteError: (deleteError: string) => patchState(store, { deleteLoading: false, deleteError }),
    }))
  );
}
