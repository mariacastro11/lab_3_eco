import { SidebarLayout, type SidebarItem } from "./SidebarLayout";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MopedIcon from "@mui/icons-material/Moped";

export const DeliveryLayout = () => {
  const items: SidebarItem[] = [
    { label: "Available Orders", path: "/delivery/available-orders", icon: <ListAltIcon /> },
    { label: "My Deliveries", path: "/delivery/my-deliveries", icon: <MopedIcon /> },
  ];

  return <SidebarLayout title="Delivery Driver" items={items} themeColor="lime" />;
};
