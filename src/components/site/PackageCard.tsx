import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BedDouble, CalendarDays, Clock, MapPin, Star } from "lucide-react";
import { parseLocalDate } from "@/lib/dates";
import { formatBDT } from "@/lib/money";
import type { Package } from "@/lib/api/types";

type Props = {
  pkg: Package;
  index?: number;
  /** Where the "Itinerary" button goes — a route (e.g. "/packages") on
   *  pages with no itinerary section of their own, or an in-page anchor
   *  (e.g. "#pkg-3-itinerary") on the packages page, which draws one below
   *  every card. */
  itineraryHref: string;
  fallbackImage: string;
};

/** One tour card — the same compact, data-driven layout everywhere a
 *  package is browsed (homepage "Upcoming departures" and the /packages
 *  page). Every stat shown is real: no fabricated ratings or photo counts
 *  for fields the backend doesn't track. */
export function PackageCard({ pkg, index = 0, itineraryHref, fallbackImage }: Props) {
  const start = parseLocalDate(pkg.start_date);
  const end = parseLocalDate(pkg.end_date);
  const title = pkg.marketing_title || `${pkg.ship.name} Voyage`;
  const dateRange = `${start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
  const rating = pkg.rating ? Number(pkg.rating) : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group rounded-2xl border border-border bg-card shadow-luxe overflow-hidden hover-lift"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={pkg.hero_image || fallbackImage}
          alt={title}
          loading="lazy"
          className="image-zoom absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean/70 via-transparent to-transparent" />
        <span
          className={`absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] backdrop-blur-md ${
            pkg.is_bookable
              ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/40"
              : "bg-destructive/25 text-red-100 ring-1 ring-destructive/40"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${pkg.is_bookable ? "bg-emerald-400 animate-pulse" : "bg-red-300"}`}
          />
          {pkg.is_bookable ? "Booking open" : "Closed"}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="font-display text-xl leading-tight">{dateRange}</div>
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-600 ring-1 ring-emerald-500/25">
            {pkg.available_rooms > 0 ? `${pkg.available_rooms} cabins free` : "Fully booked"}
          </span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">{pkg.ship.name}</div>

        {pkg.marketing_description && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {pkg.marketing_description}
          </p>
        )}

        <div className="mt-5 grid grid-cols-3 gap-2 py-4 border-y border-border">
          <div className="flex flex-col items-center gap-1 text-center">
            <Clock className="size-3.5 text-gold" />
            <span className="eyebrow text-[8px] text-muted-foreground">Duration</span>
            <span className="text-xs font-semibold">
              {pkg.days}D/{pkg.nights}N
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center border-x border-border">
            <CalendarDays className="size-3.5 text-gold" />
            <span className="eyebrow text-[8px] text-muted-foreground">Departs</span>
            <span className="text-xs font-semibold">
              {start.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            {rating !== null ? (
              <>
                <Star className="size-3.5 text-gold fill-gold" />
                <span className="eyebrow text-[8px] text-muted-foreground">Rating</span>
                <span className="text-xs font-semibold">{rating.toFixed(1)}/5</span>
              </>
            ) : (
              <>
                <BedDouble className="size-3.5 text-gold" />
                <span className="eyebrow text-[8px] text-muted-foreground">Cabins</span>
                <span className="text-xs font-semibold">{pkg.available_rooms} free</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="eyebrow text-muted-foreground text-[9px]">From / adult</div>
            <div className="font-display text-xl text-gold-text leading-none mt-1">
              {formatBDT(pkg.adult_price)}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {pkg.is_bookable ? (
            <Link
              to="/booking"
              search={{ package: pkg.id }}
              className="flex-1 text-center px-4 py-2.5 rounded-full gradient-gold text-ocean text-[10px] uppercase tracking-[0.16em] font-semibold hover-lift shadow-luxe"
            >
              Book Now
            </Link>
          ) : (
            <span className="flex-1 text-center px-4 py-2.5 rounded-full bg-muted text-muted-foreground text-[10px] uppercase tracking-[0.16em] font-semibold cursor-not-allowed">
              Closed
            </span>
          )}
          <a
            href={itineraryHref}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-border text-foreground text-[10px] uppercase tracking-[0.16em] font-medium hover:border-gold hover:text-gold-text transition-colors"
          >
            <MapPin className="size-3" /> Itinerary
          </a>
        </div>
      </div>
    </motion.article>
  );
}
