
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

async function discoverTables() {
  const commonTables = ["orders", "items", "stores", "products", "order_status", "tracking", "locations"];
  for (const table of commonTables) {
    const { error } = await supabase.from(table).select("*").limit(0);
    if (error) {
      console.log(`Table '${table}': NOT FOUND (${error.message})`);
    } else {
      console.log(`Table '${table}': FOUND`);
    }
  }
}

discoverTables();
