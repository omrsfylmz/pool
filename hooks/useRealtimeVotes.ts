import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface VoteUpdate {
  food_option_id: string;
  count: number;
  voters: string[];
}

export function useRealtimeVotes(poolId: string | null) {
  const [votes, setVotes] = useState<Record<string, VoteUpdate>>({});
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
        .from("votes")
        .select(
          `
          id,
          food_option_id,
          user_id,
          profiles:user_id (avatar_animal)
        `
        )
        .eq("pool_id", poolId);

      if (!error && data) {
        const votesByOption: Record<string, VoteUpdate> = {};
        data.forEach((vote: any) => {
          if (!votesByOption[vote.food_option_id]) {
            votesByOption[vote.food_option_id] = { 
              food_option_id: vote.food_option_id,
              count: 0, 
              voters: [] 
            };
          }
          votesByOption[vote.food_option_id].count++;
          votesByOption[vote.food_option_id].voters.push(vote.profiles.avatar_animal);
        });
        setVotes(votesByOption);
      }
      setLoading(false);

      // Subscribe to changes
      channel = supabase
        .channel(`votes:${poolId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "votes",
            filter: `pool_id=eq.${poolId}`,
          },
          async () => {
            // Refetch votes when changes occur
            const { data } = await supabase
              .from("votes")
              .select(
                `
                id,
                food_option_id,
                user_id,
                profiles:user_id (avatar_animal)
              `
              )
              .eq("pool_id", poolId);

            if (data) {
              const votesByOption: Record<string, VoteUpdate> = {};
              data.forEach((vote: any) => {
                if (!votesByOption[vote.food_option_id]) {
                  votesByOption[vote.food_option_id] = { 
                    food_option_id: vote.food_option_id,
                    count: 0, 
                    voters: [] 
                  };
                }
                votesByOption[vote.food_option_id].count++;
                votesByOption[vote.food_option_id].voters.push(vote.profiles.avatar_animal);
              });
              setVotes(votesByOption);
            }
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

  return { votes, loading };
}
