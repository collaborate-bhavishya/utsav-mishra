import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useSupabaseList(table, mapRow, fallback) {
  const [items, setItems] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from(table)
      .select("*")
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        setItems(data.length ? data.map(mapRow) : fallback);
      });
    return () => { cancelled = true; };
  }, [table]);

  return items;
}
