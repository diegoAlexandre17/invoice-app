import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import { UserDropDown } from "./UserDropDown";

const items = [
  { title: "dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "customers", url: "/admin/customers", icon: Handshake },
  { title: "invoices", url: "/admin/invoice", icon: Receipt },
  { title: "settings", url: "/admin/settings", icon: Settings },
];

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}

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
                  <SidebarMenuButton asChild className="transition-transform duration-200 ease-in-out hover:translate-x-2">
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
      <SidebarFooter>
        <UserDropDown user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
