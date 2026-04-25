
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

async function forceError() {
  console.log("Forcing error on orders to see columns...");
  // @ts-ignore
  const { data, error } = await supabase.from("orders").insert({}).select();
  if (error) {
    console.error("FORCED ERROR:", error);
  } else {
    console.log("SUCCESS (Strange):", data);
  }
}

forceError();
