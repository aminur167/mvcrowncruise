import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { SectionHeader } from "./SectionHeader";
import { PackageCard } from "./PackageCard";
import { usePackages } from "@/hooks/queries/usePackages";
import heroImg from "@/assets/hero-cruise.jpg";

/** Live "next sailings" strip on the homepage — the fastest route from landing
 * to the booking wizard. Renders nothing while loading or when no voyage is
 * open, so the page never shows an empty shell. */
export function UpcomingDepartures() {
  const { data: packages } = usePackages();
  // API is ordered by start_date, so the first bookable ones are the soonest.
  const packageList = Array.isArray(packages) ? packages : [];
  const upcoming = packageList.filter((p) => p.is_bookable).slice(0, 3);
  if (!upcoming.length) return null;

  return (
    <section className="relative py-20 md:py-24 bg-background border-b border-border">
      <div className="container-luxe">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <SectionHeader
            eyebrow="Now boarding"
            title={
              <>
                Upcoming <em className="not-italic">departures.</em>
              </>
            }
            description="Real sailing dates, open for booking right now — pick one and reserve your room in minutes."
          />
          <Link
            to="/packages"
            className="inline-flex items-center gap-2 text-ocean text-sm uppercase tracking-[0.18em] hover:text-gold transition-colors border-b border-ocean/30 hover:border-gold pb-1 self-start"
          >
            All packages <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {upcoming.map((pkg, i) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              index={i}
              itineraryHref="/packages"
              fallbackImage={heroImg}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
