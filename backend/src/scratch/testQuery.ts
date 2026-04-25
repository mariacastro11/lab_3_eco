
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

async function testQuery() {
  console.log("Testing basic query on orders...");
  const { data, error } = await supabase.from("orders").select("id, status").limit(1);
  if (error) {
    console.error("QUERY ERROR:", error);
  } else {
    console.log("QUERY SUCCESS:", data);
  }
}

testQuery();
