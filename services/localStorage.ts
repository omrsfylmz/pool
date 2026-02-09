import AsyncStorage from '@react-native-async-storage/async-storage';

const HIDDEN_POOLS_KEY = '@hidden_pools';

export const localStorage = {
  /**
   * Get list of hidden pool IDs
   */
  getHiddenPoolIds: async (): Promise<string[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(HIDDEN_POOLS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading hidden pools:', e);
      return [];
    }
  },

  /**
   * Hide a pool by ID
   */
  hidePool: async (poolId: string): Promise<void> => {
    try {
      const currentIds = await localStorage.getHiddenPoolIds();
      if (!currentIds.includes(poolId)) {
        const newIds = [...currentIds, poolId];
        await AsyncStorage.setItem(HIDDEN_POOLS_KEY, JSON.stringify(newIds));
      }
    } catch (e) {
      console.error('Error hiding pool:', e);
    }
  },

  /**
   * Unhide all pools (for debugging or settings)
   */
  clearHiddenPools: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(HIDDEN_POOLS_KEY);
    } catch (e) {
      console.error('Error clearing hidden pools:', e);
    }
  }
};
