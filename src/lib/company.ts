/** Legal and contact identity of the operating company, in one place.
 *
 *  SSLCommerz's merchant compliance requires the trade licence number, the
 *  registered address from that licence, and company/management details to be
 *  reachable from the site footer. Those facts appear on several pages
 *  (footer, About, Terms, Privacy, Refund), and a number that disagrees
 *  between two pages is worse than one that is missing — so every page reads
 *  them from here.
 *
 *  Sources of truth (keep the documents in the office file; SSLCommerz
 *  verifies the site against them):
 *    - VAT registration certificate — BIN, e-TIN, entity name, registered
 *      address, ownership type. Issued 09/11/2025.
 *    - Trade licence 19/545.
 *
 *  NOTE: the sister ship's site (MV Alaska, operated by Jui Tourism and
 *  Shipping Lines) carries a DIFFERENT licence, TIN and BIN. The numbers below
 *  belong to Metamorphosis Tourism only — never copy them between the sites.
 */

export const COMPANY = {
  /** Legal name exactly as printed on the VAT registration certificate. */
  legalName: "Metamorphosis Tourism & Shipping Lines",

  /** The brand this ship sails under. */
  brandName: "MV THE CROWN",

  /** Registered address, verbatim from the VAT certificate. SSLCommerz checks
   *  this against the document, so do not reformat or abbreviate it. */
  address: {
    line1: "71 KDA Avenue, Sony Rangs Building",
    city: "Khulna-9100",
    country: "Bangladesh",
  },

  /** Trading office. */
  branchAddress: {
    line1: "13/A Planners Tower, Banglamotor",
    city: "Dhaka",
    country: "Bangladesh",
  },

  support: {
    emails: ["metamorphosistourism25@gmail.com", "info@mvthecrown.com"],
    phones: ["+880 1831-694307", "+880 1550-699732"],
  },

  /** SSLCommerz asks for "management details" alongside the company ones.
   *  The business is a proprietorship, so the proprietor is the first row. */
  management: [{ name: "Abdullah Al Masud Talukder", title: "Proprietor" }],

  /** Rows with an empty value are dropped everywhere they are rendered — a
   *  blank number reads as an unregistered business, which is worse than an
   *  absent row. So an unknown DBID simply does not appear. */
  registration: {
    tradeLicence: "19/545",
    tin: "483168548140",
    bin: "007504871-0801",
    dbid: "",
  },

  /** Ownership type and activity, as registered for VAT. */
  ownershipType: "Proprietorship",
  businessActivity: "Services — Tours & Travels",

  /** Shown at the top of each policy page so a reader knows how current it is. */
  policiesUpdated: "September 2026",
} as const;

/** Registered-address string used in prose and in the footer. */
export const registeredAddress = formatAddress(COMPANY.address);
export const branchAddress = formatAddress(COMPANY.branchAddress);

export function formatAddress(a: { line1: string; city: string; country: string }): string {
  return `${a.line1}, ${a.city}, ${a.country}`;
}

/** The address customers should write to. */
export const supportEmail = COMPANY.support.emails[0];

/** The reservations line — the number shown in the navbar, the floating CTA and
 *  every "call us" fallback. First in the list by convention. */
export const primaryPhone = COMPANY.support.phones[0];

/** `+880 1831-694307` → `+8801831694307`, for a tel: href. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, "")}`;

/** wa.me wants digits only, no leading '+'. */
export const whatsappNumber = primaryPhone.replace(/\D/g, "");

/** A WhatsApp deep link, optionally pre-filled with a message. */
export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Registration rows for the footer strip and the About table, with unknown
 *  numbers filtered out. */
export function registrationRows(): { label: string; value: string }[] {
  const { tradeLicence, tin, bin, dbid } = COMPANY.registration;
  return [
    { label: "Trade Licence No.", value: tradeLicence },
    { label: "TIN", value: tin },
    { label: "BIN (VAT Reg.)", value: bin },
    { label: "DBID", value: dbid },
  ].filter((row) => row.value);
}

/** Fallback refund window in working days.
 *
 *  The real figure is per-ship and comes from the API (`refund_sla_days` on the
 *  cancellation-policy endpoint), which is also what the cancellation email
 *  promises — so the page and the email can never quote different numbers.
 *  This value is used only when that call has not returned. */
export const REFUND_SLA_FALLBACK_DAYS = 10;
