import { useState } from "react";
import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import {
  Anchor,
  BedDouble,
  CalendarRange,
  ChefHat,
  ChevronLeft,
  ClipboardList,
  DoorOpen,
  Images,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { NotificationBell } from "@/components/staff/NotificationBell";
import { getStaffNotifications, staffLogout } from "@/lib/api/staff";
import { clearStaffSession, getRefreshToken, isStaffLoggedIn } from "@/lib/staffAuth";

export const Route = createFileRoute("/staff")({
  component: StaffLayout,
  beforeLoad: () => {
    if (!isStaffLoggedIn()) {
      throw redirect({ to: "/staff/login" });
    }
  },
  head: () => ({ meta: [{ title: "Staff Dashboard — MV THE CROWN" }] }),
});

const NAV = [
  { to: "/staff", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/staff/bookings", label: "Bookings", icon: ClipboardList, exact: false },
  { to: "/staff/messages", label: "Messages", icon: MessageSquare, exact: false },
  { to: "/staff/refunds", label: "Refunds", icon: Wallet, exact: false },
  { to: "/staff/packages", label: "Packages", icon: CalendarRange, exact: false },
  { to: "/staff/rooms", label: "Rooms", icon: BedDouble, exact: false },
  { to: "/staff/cabins", label: "Cabins", icon: DoorOpen, exact: false },
  { to: "/staff/gallery", label: "Gallery", icon: Images, exact: false },
  { to: "/staff/room-settings", label: "Room settings", icon: SlidersHorizontal, exact: false },
  { to: "/staff/food-menu", label: "Food Menu", icon: ChefHat, exact: false },
  { to: "/staff/settings", label: "Settings", icon: Settings, exact: false },
] as const;

const COLLAPSE_KEY = "staff.sidebar.collapsed";

function StaffLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === "1");

  // Same query key as the bell, so the badge and the popover are one fetch and
  // can never disagree about how much is waiting.
  const { data: notifications } = useQuery({
    queryKey: ["staff", "notifications"],
    queryFn: getStaffNotifications,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
  // Refund work that has gone stale: requests nobody has answered, plus
  // payouts past the window published to the customer.
  const refundsWaiting =
    (notifications?.pending_cancellations.count ?? 0) + (notifications?.overdue_payouts.count ?? 0);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  async function handleLogout() {
    const refresh = getRefreshToken();
    try {
      if (refresh) await staffLogout(refresh);
    } finally {
      clearStaffSession();
      navigate({ to: "/staff/login" });
    }
  }

  // Collapsed = icon rail; expanded = full labels. Fixed to the viewport so the
  // nav never scrolls away; content is offset by a matching margin.
  const width = collapsed ? "w-16" : "w-60";

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 ${width} bg-linear-to-b from-ocean to-midnight text-background flex flex-col transition-[width] duration-300 ease-in-out`}
      >
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/10 shrink-0">
          <div className="size-8 rounded-lg gradient-gold grid place-items-center shrink-0">
            <Anchor className="size-4 text-ocean" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-display text-lg leading-none truncate">MV THE CROWN</div>
              <div className="eyebrow text-gold-soft text-[8px] mt-0.5">Staff Dashboard</div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 lg:px-3 overflow-y-auto scroll-subtle">
          {NAV.map(({ to, label, icon: Icon, exact }) => {
            // Refunds is the only item carrying work that goes stale: a
            // cancellation nobody answers, or a payout past the window we
            // published to the customer.
            const badge = to === "/staff/refunds" ? refundsWaiting : 0;
            return (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact }}
                title={collapsed ? label : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-background/70 hover:text-background hover:bg-white/5 transition-colors [&.active]:bg-gold/15 [&.active]:text-gold-soft ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <Icon className="size-4.5 shrink-0" />
                {!collapsed && <span className="truncate">{label}</span>}
                {badge > 0 &&
                  // On the collapsed rail there is no room for a number, so it
                  // becomes a dot — still visible, which is the point.
                  (collapsed ? (
                    <span
                      aria-label={`${badge} waiting`}
                      className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive"
                    />
                  ) : (
                    <span className="ml-auto min-w-5 h-5 px-1.5 rounded-full bg-destructive text-[10px] font-semibold text-white grid place-items-center">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  ))}
              </Link>
            );
          })}
        </nav>

        {/* The bell shares the logout row — icon only, no label. Settings ›
            Account already says who is signed in, so the line that used to sit
            here was a second answer to a question nobody asked twice. */}
        <div className="p-2 lg:p-3 border-t border-white/10 shrink-0 flex items-center gap-1">
          <button
            onClick={handleLogout}
            title={collapsed ? "Log out" : undefined}
            className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-background/70 hover:text-destructive hover:bg-white/5 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="size-4.5 shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
          {!collapsed && <NotificationBell />}
        </div>

        {/* Collapse / expand toggle — sits on the sidebar's edge */}
        <button
          onClick={toggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute top-13 -right-3 z-50 size-6 rounded-full bg-card border border-border text-ocean grid place-items-center shadow-md hover:text-gold hover:border-gold transition-colors"
        >
          <ChevronLeft
            className={`size-3.5 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </aside>

      {/* Content — offset by the sidebar width */}
      <div
        className={`min-w-0 overflow-x-hidden transition-[margin] duration-300 ease-in-out ${
          collapsed ? "ml-16" : "ml-60"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
