
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

async function checkStores() {
  console.log("Checking stores table...");
  const { data, error } = await supabase.from("stores").select("*").limit(1);
  if (error) {
    console.error("STORES ERROR:", error);
  } else {
    console.log("Stores structure:", data[0] ? Object.keys(data[0]) : "No stores found");
    console.log("Sample store:", data[0]);
  }
}

checkStores();
