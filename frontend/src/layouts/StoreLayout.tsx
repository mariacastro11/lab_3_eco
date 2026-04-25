import { SidebarLayout, type SidebarItem } from "./SidebarLayout";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export const StoreLayout = () => {
  const items: SidebarItem[] = [
    { label: "My Store", path: "/store/my-store", icon: <StorefrontIcon /> },
    { label: "Create Product", path: "/store/create-product", icon: <AddCircleIcon /> },
    { label: "Store Orders", path: "/store/orders", icon: <FormatListBulletedIcon /> },
  ];

  return <SidebarLayout title="Store Manager" items={items} themeColor="orange" />;
};
