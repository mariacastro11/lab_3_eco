
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

async function probeColumns() {
  console.log("Probing columns for orders...");
  const { data, error } = await supabase.from("orders").insert({
    user_id: "3d19143a-c49f-49a9-87e2-3ec15778e849",
    store_id: "f0d5f26b-c574-4748-b95c-ca0b987d17ee"
  }).select();
  
  if (error) {
    console.error("PROBE ERROR:", error);
  } else {
    console.log("PROBE SUCCESS:", data);
  }
}

probeColumns();
