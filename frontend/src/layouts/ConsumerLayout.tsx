import { SidebarLayout, type SidebarItem } from "./SidebarLayout";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export const ConsumerLayout = () => {
  const items: SidebarItem[] = [
    { label: "Stores", path: "/consumer/stores", icon: <StorefrontIcon /> },
    { label: "Cart", path: "/consumer/cart", icon: <ShoppingCartIcon /> },
    { label: "My Orders", path: "/consumer/my-orders", icon: <ReceiptLongIcon /> },
  ];

  return <SidebarLayout title="Rappi Consumer" items={items} themeColor="teal" />;
};
