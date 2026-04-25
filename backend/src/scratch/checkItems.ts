
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

async function checkItems() {
  const { data, error } = await supabase.from("items").select("*").limit(1);
  if (error) {
    console.error("Error fetching items:", error);
  } else {
    console.log("Items structure:", data[0] ? Object.keys(data[0]) : "No items found");
    console.log("Sample item:", data[0]);
  }
}

checkItems();
