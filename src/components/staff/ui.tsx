import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";

import type { ApiError, BookingStatus } from "@/lib/api/types";

/** Field names as staff know them, where the column name is not the answer.
 *  Anything absent falls through to `labelFor()`, which un-snakes the key. */
const FIELD_LABELS: Record<string, string> = {
  base_price: "Cabin price",
  adult_price: "Adult fare",
  default_adult_price: "Default adult fare",
  foreigner_adult_surcharge: "Foreign adult surcharge",
  foreigner_kid_surcharge: "Foreign child surcharge",
  min_deposit_percent: "Minimum deposit",
  min_first_payment: "Minimum first payment",
  booking_cutoff_datetime: "Booking cutoff",
  max_adults: "Maximum adults",
  max_kids: "Maximum children",
  group_min_pax: "Group minimum guests",
  refund_sla_days: "Refund window",
  refund_account_name: "Account holder's name",
  refund_account_number: "Account number",
  refund_method: "Refund method",
  tran_id: "Transaction id",
  discount_type: "Offer type",
  discount_value: "Discount amount",
  offer_label: "Offer label",
  offer_ends_at: "Offer end time",
  sort_order: "Display order",
  room_id: "Cabin",
  package_id: "Package",
  image: "Photo",
  hero_image: "Cover photo",
  main_image: "Main photo",
  layout_image: "Deck plan",
};

/** Keys that are about the request as a whole, so naming a field would lie. */
const WHOLE_FORM = new Set(["non_field_errors", "__all__", "detail"]);

function labelFor(key: string) {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  const words = key.replace(/_/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : key;
}

/** DRF's stock validation sentences. Every one of them says "this field" and
 *  none of them says which, so two errors side by side read identically. */
const STOCK: [RegExp, (label: string, match: RegExpMatchArray) => string][] = [
  [/^this field is required\.?$/i, (l) => `${l} is required.`],
  [/^this field may not be null\.?$/i, (l) => `${l} is required.`],
  [/^no file was submitted\.?$/i, (l) => `${l} is required.`],
  [/^this field may not be blank\.?$/i, (l) => `${l} cannot be empty.`],
  [/^this field must be unique\.?$/i, (l) => `${l} is already taken.`],
  [/^a valid (?:number|decimal) is required\.?$/i, (l) => `${l} must be a number.`],
  [/^a valid integer is required\.?$/i, (l) => `${l} must be a whole number.`],
  [/^enter a valid date.*$/i, (l) => `${l} is not a valid date.`],
  [/^date has wrong format.*$/i, (l) => `${l} must be a real date, written as YYYY-MM-DD.`],
  [/^datetime has wrong format.*$/i, (l) => `${l} must be a real date and time.`],
  [/^enter a valid email address\.?$/i, (l) => `${l} is not a valid email address.`],
  [/^"?(.+?)"? is not a valid choice\.?$/i, (l, m) => `${l}: "${m[1]}" is not one of the options.`],
  [
    /^ensure this value is greater than or equal to (.+?)\.?$/i,
    (l, m) => `${l} must be ${m[1]} or more.`,
  ],
  [
    /^ensure this value is less than or equal to (.+?)\.?$/i,
    (l, m) => `${l} must be ${m[1]} or less.`,
  ],
  [
    /^ensure this field has no more than (\d+) characters\.?$/i,
    (l, m) => `${l} must be ${m[1]} characters or fewer.`,
  ],
  [
    /^ensure this field has at least (\d+) characters\.?$/i,
    (l, m) => `${l} must be at least ${m[1]} characters.`,
  ],
  [
    /^ensure that there are no more than (\d+) digits in total\.?$/i,
    (l, m) => `${l} has more than ${m[1]} digits.`,
  ],
];

/** One field's complaint, in a sentence that names the field.
 *
 *  Only DRF's stock templates are rewritten. Everything the backend wrote
 *  itself ("End date must be after start date.") is already English and is
 *  passed through untouched — rephrasing it here would mean maintaining the
 *  same sentence in two repositories.
 */
function humanise(key: string, message: string) {
  const text = message.trim();
  if (WHOLE_FORM.has(key)) return text;

  const label = labelFor(key);
  for (const [pattern, write] of STOCK) {
    const match = text.match(pattern);
    if (match) return write(label, match);
  }
  // "Must be at least 1 night." names no subject. Lend it the field's.
  if (/^must /i.test(text)) return `${label} ${text[0].toLowerCase()}${text.slice(1)}`;
  // Our own messages are written for a person already. Introduce one by field
  // only when it does not name itself — "End date: End date must be after
  // start date." helps nobody.
  if (text.toLowerCase().startsWith(label.toLowerCase())) return text;
  return `${label}: ${text}`;
}

/** For when the server sent no sentence of its own — or no body at all. */
const BY_STATUS: Record<number, string> = {
  0: "No connection to the server. Check your internet, then try again.",
  400: "Some of the details were rejected. Check the form and try again.",
  401: "Your session has expired. Sign in again.",
  403: "You are not allowed to do that.",
  404: "That record no longer exists — someone may have removed it.",
  405: "That action is not allowed here.",
  409: "Someone else changed this while you had it open. Reload and try again.",
  413: "That file is too large to upload.",
  429: "Too many attempts. Wait a moment, then try again.",
  500: "The server failed on that request. Nothing was saved.",
  // Render idles the service out; the first request back can arrive before it
  // is listening again.
  502: "The server is not answering — it may still be waking up. Try again in a moment.",
  503: "The server is not answering — it may still be waking up. Try again in a moment.",
  504: "The server took too long to answer. Try again.",
};

/** What the staff member actually reads in the toast.
 *
 *  Was `end_date: This field is required.` — a column name they have never
 *  seen, glued to a sentence that names no field at all. Now: `End date is
 *  required.`
 */
export function errorText(err: unknown) {
  const apiError = (err ?? {}) as ApiError;

  if (apiError.fieldErrors) {
    const lines = Object.entries(apiError.fieldErrors)
      .map(([key, messages]) => humanise(key, messages.join(" ")))
      .filter(Boolean);
    if (lines.length > 3) {
      const rest = lines.length - 3;
      return `${lines.slice(0, 3).join(" · ")} (+${rest} more problem${rest === 1 ? "" : "s"})`;
    }
    if (lines.length) return lines.join(" · ");
  }

  // A dropped connection carries axios's own "Network Error", which tells the
  // reader nothing they can act on.
  if (!apiError.status) return BY_STATUS[0];

  return apiError.detail || BY_STATUS[apiError.status] || "Something went wrong.";
}

export function DialogShell({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Wider body for media-heavy dialogs (photo galleries etc.). */
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ocean/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative bg-card rounded-2xl shadow-luxe w-full max-h-[85vh] overflow-y-auto scroll-subtle ${
          wide ? "max-w-3xl" : "max-w-xl"
        }`}
      >
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-display text-xl">{title}</h2>
          <button
            onClick={onClose}
            className="size-8 rounded-full grid place-items-center hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium mt-0.5">{value}</div>
    </div>
  );
}

export function StaffField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground text-[10px] block mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const staffInputClass =
  "w-full bg-background border border-border rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-gold";

/* ── Shared status styling (single source of truth) ───────────────────────── */

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Pending",
  partially_paid: "Partially paid",
  fully_paid: "Fully paid",
  cancelled: "Cancelled",
  completed: "Completed",
};

/** Pill classes per booking status — muted amber / emerald / red on tinted bg. */
export const STATUS_STYLE: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  partially_paid: "bg-amber-100 text-amber-700",
  fully_paid: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-600",
  completed: "bg-emerald-100 text-emerald-700",
};

/** Solid dot color per status — for legends / list rows. */
export const STATUS_DOT: Record<BookingStatus, string> = {
  pending: "bg-amber-500",
  partially_paid: "bg-amber-500",
  fully_paid: "bg-emerald-500",
  cancelled: "bg-red-500",
  completed: "bg-emerald-600",
};

export const STATUS_ORDER: BookingStatus[] = [
  "pending",
  "partially_paid",
  "fully_paid",
  "completed",
  "cancelled",
];

/** Package lifecycle status → pill classes (distinct from booking statuses). */
export const PACKAGE_STATUS_STYLE: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  open: "bg-emerald-100 text-emerald-700",
  closed: "bg-amber-100 text-amber-700",
  completed: "bg-ocean/10 text-ocean",
  cancelled: "bg-red-100 text-red-600",
};

export function PackageStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold capitalize whitespace-nowrap ${
        PACKAGE_STATUS_STYLE[status] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

/* ── Page & section scaffolding ───────────────────────────────────────────── */

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  );
}

export function SectionCard({
  title,
  icon: Icon,
  action,
  bodyClassName = "",
  className = "",
  children,
}: {
  title?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  bodyClassName?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-2">
          <span className="eyebrow text-muted-foreground text-[10px] flex items-center gap-2">
            {Icon && <Icon className="size-3.5 text-ocean/50" />}
            {title}
          </span>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  highlight = false,
  tone = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: React.ReactNode;
  highlight?: boolean;
  tone?: "default" | "gold" | "emerald" | "destructive";
}) {
  const valueTone =
    tone === "gold"
      ? "text-gold"
      : tone === "emerald"
        ? "text-emerald-600"
        : tone === "destructive"
          ? "text-destructive"
          : "";
  return (
    <div
      className={`group rounded-2xl border p-5 transition-shadow hover:shadow-luxe ${
        highlight ? "border-gold/40 bg-gold/5" : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow text-muted-foreground text-[10px]">{label}</span>
        <span
          className={`size-8 rounded-lg grid place-items-center transition-colors ${
            highlight ? "bg-gold/15 text-gold" : "bg-muted text-ocean/50 group-hover:text-gold"
          }`}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <div className={`font-display text-3xl mt-3 ${highlight ? "text-gold" : valueTone}`}>
        {value}
      </div>
      {hint && <div className="text-xs text-muted-foreground mt-1.5">{hint}</div>}
    </div>
  );
}
