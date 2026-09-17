import type { Money, PackageOffer } from "./api/types";

/** An offer in the shape the components want, whichever spelling the API is on.
 *
 *  ⚠ The two halves of this site deploy separately, and not at the same speed:
 *  Vercel is live in seconds, Render takes minutes and can fail outright. So
 *  after a release there is a real window where the browser is the new build
 *  and the API is still the old one.
 *
 *  That window is not hypothetical — it shipped. The API aliases were added on
 *  the SERVER (emit both spellings), which covers an old browser against a new
 *  API, and the actual race ran the other way: a new browser read `offer.value`
 *  from an old API, got undefined, and rendered "৳NaN off per cabin" across a
 *  photograph on the live site.
 *
 *  Reading both spellings here costs nothing and closes the window in the
 *  direction the server aliases could not. Delete the fallbacks once the
 *  aliases are gone from the API.
 */
export type ReadableOffer = {
  label: string;
  type: "percent" | "fixed";
  value: Money;
  endsAt: string | null;
  before: Money;
  /** Null for a fixed-amount offer: it comes off the cabin and has no honest
   *  per-adult equivalent. */
  after: Money | null;
};

export function readOffer(offer: PackageOffer | null | undefined): ReadableOffer | null {
  if (!offer) return null;

  // "flat" was this API's old name for "fixed". Same offer, same arithmetic.
  const raw = offer.type ?? offer.discount_type ?? null;
  const type = raw === "flat" ? "fixed" : raw;
  const value = offer.value ?? offer.discount_value ?? null;
  // Without both of these there is nothing truthful to render, and a badge
  // that renders anyway is how NaN reached a customer.
  if (type === null || value === null) return null;

  const before = offer.adult_price_before ?? offer.was_price ?? null;
  // Only a percentage has an after-price. The old API computed one for fixed
  // offers too, by subtracting a per-cabin discount from a per-adult fare —
  // never show that number, whichever spelling it arrives under.
  const after = type === "percent" ? (offer.adult_price_after ?? offer.now_price ?? null) : null;

  return {
    label: offer.label ?? "",
    type,
    value,
    endsAt: offer.ends_at ?? null,
    before: before ?? "0.00",
    after,
  };
}
