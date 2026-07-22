"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  HomeIcon,
  PackageIcon,
  TagIcon,
  GridIcon,
  ShoppingBagIcon,
  UserIcon,
  StarIcon,
  SettingsIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  LogoutIcon,
  MenuIcon,
} from "@/lib/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/sonner";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: HomeIcon },
  { title: "Products", href: "/admin/products", icon: PackageIcon },
  { title: "Categories", href: "/admin/categories", icon: TagIcon },
  { title: "Collections", href: "/admin/collections", icon: GridIcon },
  { title: "Orders", href: "/admin/orders", icon: ShoppingBagIcon },
  { title: "Customers", href: "/admin/customers", icon: UserIcon },
  { title: "Coupons", href: "/admin/coupons", icon: TagIcon },
  { title: "Reviews", href: "/admin/reviews", icon: StarIcon },
];

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="!border-r-0 [&>[data-slot=sidebar-inner]]:bg-[#0A0A0A] [&>[data-slot=sidebar-inner]]:border-none"
      style={
        {
          "--sidebar": "#0A0A0A",
          "--sidebar-foreground": "#F5F5F7",
          "--sidebar-primary": "#CCFF00",
          "--sidebar-primary-foreground": "#0A0A0A",
          "--sidebar-accent": "#1A1A1A",
          "--sidebar-accent-foreground": "#F5F5F7",
          "--sidebar-border": "#2A2A2A",
          "--sidebar-ring": "#CCFF00",
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#CCFF00]">
            <span className="font-heading text-sm font-bold text-[#0A0A0A]">PS</span>
          </div>
          <span className="group-data-[collapsible=icon]:hidden font-heading text-lg font-bold text-white">
            pro straps
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "!bg-[#CCFF00]/10 !text-[#CCFF00] hover:!bg-[#CCFF00]/15"
                          : "!text-gray-400 hover:!bg-white/5 hover:!text-white"
                      }
                    >
                      <Link href={item.href}>
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Settings"
              className="!text-gray-400 hover:!bg-white/5 hover:!text-white"
            >
              <Link href="/admin/settings">
                <SettingsIcon size={18} />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator className="!bg-[#2A2A2A] my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Logout"
              className="!text-gray-400 hover:!bg-white/5 hover:!text-red-400"
            >
              <button>
                <LogoutIcon size={18} />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function AdminTopbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-2 md:hidden" />
        <SidebarTrigger className="hidden md:flex" />
        <span className="text-xs text-muted-foreground md:hidden">Menu</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <SunIcon size={16} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon size={16} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg">
          <BellIcon size={16} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#CCFF00]" />
          <span className="sr-only">Notifications</span>
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 rounded-lg px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-[#0A0A0A] text-xs text-[#CCFF00]">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline-block">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-background">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AdminTopbar />
          <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </div>
  );
}