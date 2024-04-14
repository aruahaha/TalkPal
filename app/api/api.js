import { supabase } from "../lib/supabase-client";

export const getTable = async () => {
  let { data: TalkPal, error } = await supabase.from("TalkPal").select("*");
  if (error) {
    console.log(error);
  }
  if (TalkPal) {
    return TalkPal;
  }
};
