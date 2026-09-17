import type { PackageOffer } from "@/lib/api/types";
import { readOffer } from "@/lib/offer";
import { formatBDT } from "@/lib/money";

/** A sailing's per-adult price, struck through when an offer applies.
 *
 *  Both figures come from the server's `offer` object — the browser never
 *  works out the discount for itself, or a card could show one number while
 *  the checkout charges another.
 *
 *  A FIXED offer publishes no after-price, and this renders none: the discount
 *  comes off the cabin, so there is no honest per-adult figure to strike
 *  through. The badge carries that offer on its own ("৳1,500 off per cabin").
 *
 *  The price being charged leads, and the old one follows it struck through:
 *  led by the struck figure, the eye lands first on a number nobody is paying.
 *
 *  The old price is marked up with `<s>` rather than a line-through class:
 *  the strike is what makes the number mean "not this any more", and a screen
 *  reader announcing two prices with no relation between them is worse than
 *  announcing one.
 */
export function PackagePrice({
  adultPrice,
  offer,
  size = "md",
}: {
  adultPrice: string;
  offer: PackageOffer | null;
  /** "lg" for the package page's own header, "md" for cards. */
  size?: "md" | "lg";
}) {
  const live = readOffer(offer);
  const after = live?.after ?? null;
  const nowClass = size === "lg" ? "text-3xl" : "text-xl";

  return (
    <span className="inline-flex items-baseline gap-2 flex-wrap">
      <span className={`font-display ${nowClass} text-gold-text`}>
        {formatBDT(after ?? adultPrice)}
      </span>
      {after !== null && live && (
        <s className="text-sm text-muted-foreground/80 decoration-muted-foreground/50">
          {formatBDT(live.before)}
        </s>
      )}
    </span>
  );
}
