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
import { LayoutDashboard, Handshake, Receipt, Building } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { UserDropDown } from "./UserDropDown";

const items = [
  { title: "dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "customers", url: "/admin/customers", icon: Handshake },
  { title: "invoices", url: "/admin/invoices", icon: Receipt },
  { title: "company", url: "/admin/company", icon: Building },
];

export function AppSidebar() {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-6">LOGO</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={`transition-transform duration-200 py-4 h-12 ease-in-out hover:translate-x-1 ${
                          isActive
                            ? "bg-accent text-accent-foreground border-r-2 border-primary"
                            : ""
                        }`}
                      >
                        <item.icon />
                        <span>{t(`navigation.${item.title}`)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserDropDown />
      </SidebarFooter>
    </Sidebar>
  );
}
