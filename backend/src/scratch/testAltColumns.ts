
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

async function testAlternativeColumns() {
  console.log("Testing alternative columns for orders...");
  
  const testOrder = {
    user_id: "3d19143a-c49f-49a9-87e2-3ec15778e849", // ID de Maria
    store_id: "f0d5f26b-c574-4748-b95c-ca0b987d17ee",
    delivery_latitude: 4.6097,
    delivery_longitude: -74.0817
  };

  const { data, error } = await supabase
    .from("orders")
    .insert(testOrder)
    .select();

  if (error) {
    console.error("ALTERNATIVE INSERT ERROR:", error);
  } else {
    console.log("ALTERNATIVE INSERT SUCCESS:", data);
  }
}

testAlternativeColumns();
