import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { FoodOption } from "../services/api";

/**
 * Hook to subscribe to real-time food option changes for a specific pool
 * 
 * @param poolId - The pool ID to subscribe to
 * @returns Object containing food options array and loading state
 * 
 * @example
 * const { foodOptions, loading } = useRealtimeFoodOptions(poolId);
 */
export function useRealtimeFoodOptions(poolId: string | null) {
  const [foodOptions, setFoodOptions] = useState<FoodOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!poolId) {
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      // Initial fetch
      const { data, error } = await supabase
        .from("food_options")
        .select("*")
        .eq("pool_id", poolId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setFoodOptions(data as FoodOption[]);
      }
      setLoading(false);

      // Subscribe to changes
      channel = supabase
        .channel(`food_options:${poolId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "food_options",
            filter: `pool_id=eq.${poolId}`,
          },
          (payload) => {

            setFoodOptions((prev) => [...prev, payload.new as FoodOption]);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "food_options",
            filter: `pool_id=eq.${poolId}`,
          },
          (payload) => {

            setFoodOptions((prev) =>
              prev.map((option) =>
                option.id === payload.new.id ? (payload.new as FoodOption) : option
              )
            );
          }
        )
        .on(
          "postgres_changes",
          {
            event: "DELETE",
            schema: "public",
            table: "food_options",
            filter: `pool_id=eq.${poolId}`,
          },
          (payload) => {

            setFoodOptions((prev) =>
              prev.filter((option) => option.id !== payload.old.id)
            );
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [poolId]);

  return { foodOptions, loading };
}
