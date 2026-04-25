
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

async function checkSchema() {
  const { data, error } = await supabase.from("orders").select("*").limit(1);
  if (error) {
    console.error("Error fetching orders:", error);
  } else {
    console.log("Order structure:", data[0] ? Object.keys(data[0]) : "No orders found");
    console.log("Sample order:", data[0]);
  }
}

checkSchema();
