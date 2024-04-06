import { router } from "expo-router";
import React, { useEffect } from "react";
import { supabase } from "./lib/supabase-client";

const IndexPage = () => {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/home");
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    });
  }, []);
};

export default IndexPage;
