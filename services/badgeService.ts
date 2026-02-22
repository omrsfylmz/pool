import { supabase } from "../lib/supabase";
import { awardAchievement, checkAchievement } from "./api";

// ============================================
// BADGE DEFINITIONS
// ============================================

// Food category badges: icon -> badge type mapping
const FOOD_ICON_BADGES: Record<string, { badge: string; label: string }> = {
  hamburger: { badge: "burger_monster", label: "Burger Monster" },
  leaf: { badge: "salad_sultan", label: "Salad Sultan" },
  "pizza-slice": { badge: "pizza_pro", label: "Pizza Pro" },
  "pepper-hot": { badge: "taco_titan", label: "Taco Titan" },
};

// ============================================
// VOTING BADGES
// ============================================

/**
 * Called after castVote(). Checks:
 * - Food category badges (burger_monster, salad_sultan, pizza_pro, taco_titan)
 * - early_bird (voted before 11:00)
 * - consistent_voter (5th total vote)
 */
export async function checkVotingBadges(
  userId: string,
  optionIcon: string | undefined
): Promise<void> {
  try {
    // 1) Food category badge
    if (optionIcon && FOOD_ICON_BADGES[optionIcon]) {
      const { badge, label } = FOOD_ICON_BADGES[optionIcon];
      const has = await checkAchievement(userId, badge);
      if (!has) {
        await awardAchievement(userId, badge, optionIcon, label);
      }
    }

    // 2) Early bird — voted before 11:00 local time
    const now = new Date();
    const hour = now.getHours();
    if (hour < 11) {
      const has = await checkAchievement(userId, "early_bird");
      if (!has) {
        await awardAchievement(userId, "early_bird", "weather-sunny", "Early Bird");
      }
    }

    // 3) Consistent voter — total 5 votes
    const hasConsistent = await checkAchievement(userId, "consistent_voter");
    if (!hasConsistent) {
      const { count, error } = await supabase
        .from("votes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      if (!error && count !== null && count >= 5) {
        await awardAchievement(
          userId,
          "consistent_voter",
          "vote",
          "Consistent Voter"
        );
      }
    }
  } catch (error) {
    // Non-blocking: log and swallow
    console.error("[BadgeService] checkVotingBadges error:", error);
  }
}

// ============================================
// POOL ENDED BADGES
// ============================================

/**
 * Called after endPool(). Checks:
 * - winner_winner (user's voted option won 3 times total)
 */
export async function checkPoolEndedBadges(
  poolId: string
): Promise<void> {
  try {
    // Get the winning food_option_id for this pool
    const { data: pool } = await supabase
      .from("pools")
      .select("winner_id")
      .eq("id", poolId)
      .single();

    if (!pool?.winner_id) return;

    const winnerId = pool.winner_id;

    // Find all users who voted for the winning option in this pool
    const { data: winnerVotes } = await supabase
      .from("votes")
      .select("user_id")
      .eq("pool_id", poolId)
      .eq("food_option_id", winnerId);

    if (!winnerVotes || winnerVotes.length === 0) return;

    // For each user who voted for the winner, check their total win count
    for (const vote of winnerVotes) {
      const userId = vote.user_id;

      const hasWinner = await checkAchievement(userId, "winner_winner");
      if (hasWinner) continue;

      // Count how many times this user voted for the winning option across all ended pools
      // We join votes with pools where winner_id = food_option_id
      const { data: allVotes } = await supabase
        .from("votes")
        .select("id, pool_id, food_option_id")
        .eq("user_id", userId);

      if (!allVotes) continue;

      // Get all ended pools with their winners
      const poolIds = [...new Set(allVotes.map((v) => v.pool_id))];
      const { data: endedPools } = await supabase
        .from("pools")
        .select("id, winner_id")
        .in("id", poolIds)
        .eq("status", "ended")
        .not("winner_id", "is", null);

      if (!endedPools) continue;

      // Count wins: how many times user's vote matched winner
      const winnerMap = new Map(endedPools.map((p) => [p.id, p.winner_id]));
      let winCount = 0;
      for (const v of allVotes) {
        if (winnerMap.get(v.pool_id) === v.food_option_id) {
          winCount++;
        }
      }

      if (winCount >= 3) {
        await awardAchievement(
          userId,
          "winner_winner",
          "trophy",
          "Winner Winner"
        );
      }
    }
  } catch (error) {
    console.error("[BadgeService] checkPoolEndedBadges error:", error);
  }
}

// ============================================
// CREATION BADGES
// ============================================

/**
 * Called after createPool() or addFoodOption(). Checks:
 * - pool_creator (first pool created)
 * - idea_generator (5 food options added total)
 */
export async function checkCreationBadges(
  userId: string,
  type: "pool" | "food_option"
): Promise<void> {
  try {
    if (type === "pool") {
      // pool_creator — first pool created
      const has = await checkAchievement(userId, "pool_creator");
      if (!has) {
        await awardAchievement(
          userId,
          "pool_creator",
          "plus-circle",
          "Pool Creator"
        );
      }
    }

    if (type === "food_option") {
      // idea_generator — 5 food options added
      const has = await checkAchievement(userId, "idea_generator");
      if (!has) {
        const { count, error } = await supabase
          .from("food_options")
          .select("id", { count: "exact", head: true })
          .eq("creator_id", userId);

        if (!error && count !== null && count >= 5) {
          await awardAchievement(
            userId,
            "idea_generator",
            "lightbulb-on",
            "Idea Generator"
          );
        }
      }
    }
  } catch (error) {
    console.error("[BadgeService] checkCreationBadges error:", error);
  }
}

// ============================================
// BADGE PROGRESS
// ============================================

export interface BadgeProgress {
  current: number;
  target: number;
}

/**
 * Returns current progress for each badge.
 * Used by the AllBadgesModal to display circular progress bars.
 */
export async function getBadgeProgress(
  userId: string
): Promise<Record<string, BadgeProgress>> {
  const progress: Record<string, BadgeProgress> = {};

  try {
    // Fetch all earned badges at once
    const { data: earned } = await supabase
      .from("user_achievements")
      .select("achievement_type")
      .eq("user_id", userId);

    const earnedSet = new Set(earned?.map((e) => e.achievement_type) || []);

    // --- newcomer (target: 1) ---
    progress.newcomer = { current: earnedSet.has("newcomer") ? 1 : 1, target: 1 };
    // Everyone who has an account has progress 1/1

    // --- Food category badges (target: 1 each) ---
    const foodIcons = ["hamburger", "leaf", "pizza-slice", "pepper-hot"];
    const foodBadges = ["burger_monster", "salad_sultan", "pizza_pro", "taco_titan"];

    for (let i = 0; i < foodIcons.length; i++) {
      const badge = foodBadges[i];
      if (earnedSet.has(badge)) {
        progress[badge] = { current: 1, target: 1 };
      } else {
        // Check if user has ever voted for this icon
        const { count } = await supabase
          .from("votes")
          .select("id, food_options!inner(icon)", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("food_options.icon", foodIcons[i]);

        progress[badge] = { current: Math.min(count || 0, 1), target: 1 };
      }
    }

    // --- early_bird (target: 1) ---
    progress.early_bird = {
      current: earnedSet.has("early_bird") ? 1 : 0,
      target: 1,
    };

    // --- consistent_voter (target: 5) ---
    if (earnedSet.has("consistent_voter")) {
      progress.consistent_voter = { current: 5, target: 5 };
    } else {
      const { count } = await supabase
        .from("votes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);

      progress.consistent_voter = { current: Math.min(count || 0, 5), target: 5 };
    }

    // --- pool_creator (target: 1) ---
    if (earnedSet.has("pool_creator")) {
      progress.pool_creator = { current: 1, target: 1 };
    } else {
      const { count } = await supabase
        .from("pools")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", userId);

      progress.pool_creator = { current: Math.min(count || 0, 1), target: 1 };
    }

    // --- winner_winner (target: 3) ---
    if (earnedSet.has("winner_winner")) {
      progress.winner_winner = { current: 3, target: 3 };
    } else {
      // Count how many times user's vote was the winner
      const { data: allVotes } = await supabase
        .from("votes")
        .select("pool_id, food_option_id")
        .eq("user_id", userId);

      let winCount = 0;
      if (allVotes && allVotes.length > 0) {
        const poolIds = [...new Set(allVotes.map((v) => v.pool_id))];
        const { data: endedPools } = await supabase
          .from("pools")
          .select("id, winner_id")
          .in("id", poolIds)
          .eq("status", "ended")
          .not("winner_id", "is", null);

        if (endedPools) {
          const winnerMap = new Map(endedPools.map((p) => [p.id, p.winner_id]));
          for (const v of allVotes) {
            if (winnerMap.get(v.pool_id) === v.food_option_id) {
              winCount++;
            }
          }
        }
      }
      progress.winner_winner = { current: Math.min(winCount, 3), target: 3 };
    }

    // --- idea_generator (target: 5) ---
    if (earnedSet.has("idea_generator")) {
      progress.idea_generator = { current: 5, target: 5 };
    } else {
      const { count } = await supabase
        .from("food_options")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", userId);

      progress.idea_generator = { current: Math.min(count || 0, 5), target: 5 };
    }
  } catch (error) {
    console.error("[BadgeService] getBadgeProgress error:", error);
  }

  return progress;
}
