import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Settings, LayoutDashboard, Handshake, Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const items = [
  { title: "dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "customers", url: "/admin/customers", icon: Handshake },
  { title: "invoices", url: "/admin/invoice", icon: Receipt },
  { title: "settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {

  const {t} = useTranslation()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{t(`navigation.${item.title}`)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
