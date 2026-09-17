import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Bell, Clock, Inbox } from "lucide-react";
import { getStaffNotifications } from "@/lib/api/staff";
import { formatBDT } from "@/lib/money";

/** What is waiting for a human, one click from the logout row.
 *
 *  Every row links straight at the thing rather than dropping the reader on a
 *  list to find it again — that is what the search params on the refunds route
 *  are for.
 *
 *  Polled every minute and on window focus: a tab left open overnight should
 *  not still be showing yesterday's queue, and a payment held for review is
 *  money the company is sitting on.
 */
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["staff", "notifications"],
    queryFn: getStaffNotifications,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  const total =
    (data?.pending_cancellations.count ?? 0) +
    (data?.overdue_payouts.count ?? 0) +
    (data?.payments_needing_review.count ?? 0);

  // Click-outside and Escape both close it. Without the first, the popover
  // stays open behind whatever the reader clicked next.
  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={total ? `Notifications, ${total} waiting` : "Notifications"}
        aria-expanded={open}
        className="relative size-9 rounded-xl grid place-items-center text-background/70 hover:text-background hover:bg-white/5 transition-colors"
      >
        <Bell className="size-4.5" />
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-destructive text-[10px] font-semibold text-white grid place-items-center">
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-80 max-h-[70vh] overflow-y-auto scroll-subtle rounded-xl border border-border bg-card shadow-luxe text-foreground z-50">
          <div className="px-4 py-3 border-b border-border eyebrow text-[10px] text-muted-foreground">
            Needs attention
          </div>

          {total === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              <Inbox className="size-5 mx-auto mb-2 opacity-50" />
              Nothing waiting.
            </div>
          )}

          {data?.pending_cancellations.items.map((item) => (
            <Link
              key={`cancel-${item.id}`}
              to="/staff/refunds"
              search={{ request: item.id }}
              onClick={close}
              className="flex gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/60 transition-colors"
            >
              <Clock className="size-4 text-gold shrink-0 mt-0.5" />
              <div className="min-w-0 text-sm">
                <div className="font-medium truncate">Cancellation · {item.booking_code}</div>
                <div className="text-xs text-muted-foreground">
                  {item.customer_name} · {formatBDT(item.refund_amount)} to refund
                </div>
              </div>
            </Link>
          ))}

          {data?.overdue_payouts.items.map((item) => (
            <Link
              key={`payout-${item.id}`}
              to="/staff/refunds"
              search={{ tab: "register" }}
              onClick={close}
              className="flex gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/60 transition-colors"
            >
              <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
              <div className="min-w-0 text-sm">
                <div className="font-medium truncate">Payout overdue · {item.booking_code}</div>
                <div className="text-xs text-muted-foreground">
                  {formatBDT(item.amount)} · {item.days_waiting} days, promised in {item.sla_days}
                </div>
              </div>
            </Link>
          ))}

          {data?.payments_needing_review.items.map((item) => (
            <Link
              key={`review-${item.id}`}
              to="/staff/refunds"
              search={{ tab: "review" }}
              onClick={close}
              className="flex gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/60 transition-colors"
            >
              <AlertTriangle className="size-4 text-gold shrink-0 mt-0.5" />
              <div className="min-w-0 text-sm">
                <div className="font-medium truncate">Payment held · {item.booking_code}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {formatBDT(item.amount)}
                  {item.reason ? ` · ${item.reason}` : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
