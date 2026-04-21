// Store refetch function globally so it can be called from other components
let globalRefetchProfile: (() => Promise<void>) | null = null;

export const setProfileRefetch = (refetch: () => Promise<void>) => {
  globalRefetchProfile = refetch;
};

export const refetchProfileDropdown = async () => {
  if (globalRefetchProfile) {
    await globalRefetchProfile();
  }
};
