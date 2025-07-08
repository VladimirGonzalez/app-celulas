import useSWR from 'swr';
import { supabase } from '@/lib/supabaseClient';

export const useTable = (table) => {
  const fetcher = async () => {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw error;
    return data;
  };

  const { data, mutate, error, isLoading } = useSWR(table, fetcher, {
    revalidateOnFocus: false,
  });

  const upsert = async (payload) => {
    const { error } = await supabase.from(table).upsert(payload).select();
    if (!error) mutate();            // refetch
  };

  const remove = async (id) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) mutate();
  };

  return { data, upsert, remove, error, isLoading };
};
