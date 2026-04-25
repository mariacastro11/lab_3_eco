
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

async function testInsert() {
  console.log("Testing insert into orders...");
  
  // Usar un ID de usuario real si es posible, o uno aleatorio para ver si falla por FK
  const testOrder = {
    user_id: "00000000-0000-0000-0000-000000000000", 
    store_id: "00000000-0000-0000-0000-000000000000",
    status: "Creado",
    destination: "POINT(-74.0817 4.6097)"
  };

  const { data, error } = await supabase
    .from("orders")
    .insert(testOrder)
    .select();

  if (error) {
    console.error("INSERT ERROR:", error);
  } else {
    console.log("INSERT SUCCESS:", data);
  }
}

testInsert();
