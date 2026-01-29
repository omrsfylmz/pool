import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Pool } from "../services/api";

export function useRealtimePool(poolId: string | null) {
  const [pool, setPool] = useState<Pool | null>(null);
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
        .from("pools")
        .select("*")
        .eq("id", poolId)
        .single();

      if (!error && data) {
        setPool(data as Pool);
      }
      setLoading(false);

      // Subscribe to changes
      channel = supabase
        .channel(`pool:${poolId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "pools",
            filter: `id=eq.${poolId}`,
          },
          (payload) => {
            setPool(payload.new as Pool);
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

  return { pool, loading };
}
