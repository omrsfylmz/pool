import { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to subscribe to real-time changes on a Supabase table
 * 
 * @param table - Table name to subscribe to
 * @param filter - Optional filter (e.g., { column: 'pool_id', value: '123' })
 * @param onInsert - Callback when a row is inserted
 * @param onUpdate - Callback when a row is updated
 * @param onDelete - Callback when a row is deleted
 * 
 * @example
 * useRealtimeSubscription<FoodOption>(
 *   'food_options',
 *   { column: 'pool_id', value: poolId },
 *   (newOption) => setOptions(prev => [...prev, newOption]),
 *   (updatedOption) => setOptions(prev => prev.map(o => o.id === updatedOption.id ? updatedOption : o)),
 *   ({ old }) => setOptions(prev => prev.filter(o => o.id !== old.id))
 * );
 */
export function useRealtimeSubscription<T>(
  table: string,
  filter: { column: string; value: string } | null,
  onInsert?: (payload: T) => void,
  onUpdate?: (payload: T) => void,
  onDelete?: (payload: { old: T }) => void
) {
  useEffect(() => {
    if (!table) return;

    let channel: RealtimeChannel;

    const setupSubscription = () => {
      // Create unique channel name
      const channelName = filter 
        ? `${table}-${filter.column}-${filter.value}`
        : `${table}-all`;



      channel = supabase.channel(channelName);

      // Build filter string for Supabase
      const filterString = filter 
        ? `${filter.column}=eq.${filter.value}` 
        : undefined;

      // Subscribe to INSERT events
      if (onInsert) {
        channel = channel.on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: table,
            filter: filterString,
          },
          (payload) => {

            onInsert(payload.new as T);
          }
        );
      }

      // Subscribe to UPDATE events
      if (onUpdate) {
        channel = channel.on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: table,
            filter: filterString,
          },
          (payload) => {

            onUpdate(payload.new as T);
          }
        );
      }

      // Subscribe to DELETE events
      if (onDelete) {
        channel = channel.on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: table,
            filter: filterString,
          },
          (payload) => {

            onDelete({ old: payload.old as T });
          }
        );
      }

      // Subscribe to channel
      channel.subscribe((status) => {

      });
    };

    setupSubscription();

    // Cleanup on unmount
    return () => {
      if (channel) {

        supabase.removeChannel(channel);
      }
    };
  }, [table, filter?.column, filter?.value, onInsert, onUpdate, onDelete]);
}
