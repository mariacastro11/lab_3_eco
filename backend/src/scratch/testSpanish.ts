
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

async function testSpanishColumns() {
  console.log("Testing spanish columns (estado, destino)...");
  const { data, error } = await supabase.from("orders").select("estado, destino").limit(0);
  if (error) {
    console.error("SPANISH QUERY ERROR:", error);
  } else {
    console.log("SPANISH QUERY SUCCESS");
  }
}

testSpanishColumns();
