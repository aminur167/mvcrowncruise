import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Loader2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";
import { CTA } from "@/components/site/CTA";
import { PackageCard } from "@/components/site/PackageCard";
import { ItineraryMap, type Stop } from "@/components/site/ItineraryMap";
import { usePackages } from "@/hooks/queries/usePackages";
import type { Package } from "@/lib/api/types";
import deck from "@/assets/deck-sunset.jpg";
import cabin from "@/assets/cabin-luxury.jpg";
import canal from "@/assets/canal-mangrove.jpg";
import dining from "@/assets/dining-bbq.jpg";

const PKG_KEYS = ["sig", "cpl", "fam", "cor", "pho", "chr"] as const;

export const Route = createFileRoute("/packages")({
  component: PackagesPage,
  validateSearch: (s: Record<string, unknown>) => {
    const out: Record<string, string> = {};
    for (const k of PKG_KEYS) {
      const v = s[k];
      if (typeof v === "string") out[k] = v;
    }
    return out;
  },
  head: () => ({
    meta: [
      { title: "Tour Packages — MV THE CROWN Sundarbans Cruise" },
      {
        name: "description",
        content:
          "Family, couple, corporate and full-ship charter packages aboard MV THE CROWN. 3-day Sundarbans expeditions with day-by-day interactive itinerary maps.",
      },
    ],
  }),
});

// Curated visual/itinerary content the backend doesn't model (per-stop route,
// imagery, "included" copy). Matched to a real backend Package by
// marketing_title; any package without a match falls back to `fallbackTemplate`.
type MarketingTemplate = {
  img: string;
  tag: string;
  inc: string[];
  itinerary: Stop[];
};

const signature: Stop[] = [
  {
    id: "s1",
    day: 1,
    time: "Morning",
    name: "Khulna",
    x: 12,
    y: 8,
    icon: "anchor",
    desc: "Welcome aboard MV THE CROWN at Khulna jetty. Champagne reception on the sky deck as we set sail south through the Rupsha river.",
    highlights: [
      "Boarding & welcome reception",
      "Suite check-in",
      "Sky-deck briefing",
      "Sundown sail through Rupsha",
    ],
  },
  {
    id: "s2",
    day: 1,
    time: "Evening",
    name: "Mongla",
    x: 28,
    y: 22,
    icon: "waves",
    desc: "Cross into the Sundarbans buffer at Mongla. Sunset BBQ dinner on the open deck as the mangrove forest closes in around us.",
    highlights: [
      "Naturalist briefing",
      "Forest entry permits",
      "Open-deck BBQ night",
      "Mangrove silhouettes at dusk",
    ],
  },
  {
    id: "s3",
    day: 2,
    time: "Dawn",
    name: "Karamjal",
    x: 40,
    y: 36,
    icon: "trees",
    desc: "Pre-dawn excursion to Karamjal wildlife center — crocodile breeding pools, deer sanctuary and a canopy boardwalk through the forest floor.",
    highlights: [
      "Sunrise canoe ride",
      "Deer & croc sanctuary",
      "Mangrove boardwalk",
      "Naturalist-led photo walk",
    ],
  },
  {
    id: "s4",
    day: 2,
    time: "Afternoon",
    name: "Kotka",
    x: 62,
    y: 46,
    icon: "bird",
    desc: "Anchor near Kotka — the spiritual heart of the Sundarbans. Trek the watchtower, scan for Royal Bengal tigers and spotted deer at the meadow.",
    highlights: [
      "Tiger-tracking trek",
      "Watchtower viewpoint",
      "Open meadow safari",
      "Deck dinner under stars",
    ],
  },
  {
    id: "s5",
    day: 3,
    time: "Sunrise",
    name: "Jamtola Beach",
    x: 78,
    y: 56,
    icon: "sun",
    desc: "Walk the wild Bay of Bengal coastline at Jamtola — the southern edge of the world's largest mangrove. Breakfast on the sand.",
    highlights: [
      "Sunrise beach walk",
      "Wild coast picnic",
      "Shell collecting",
      "Return sail to Khulna",
    ],
  },
];

const couples: Stop[] = [
  {
    id: "c1",
    day: 1,
    time: "Morning",
    name: "Khulna",
    x: 12,
    y: 8,
    icon: "anchor",
    desc: "Honeymoon-suite check-in with rose petals and a hand-written welcome. Set sail south for an intimate first afternoon at sea.",
    highlights: [
      "Honeymoon suite",
      "Welcome champagne",
      "Couples spa intro",
      "Private deck lounger",
    ],
  },
  {
    id: "c2",
    day: 1,
    time: "Sunset",
    name: "Hiron Point",
    x: 36,
    y: 30,
    icon: "sun",
    desc: "Anchor at Hiron Point. Candlelit private dinner on the upper deck served by your dedicated steward.",
    highlights: ["Private candle dinner", "Live acoustic set", "Sunset cruise", "Star-gazing deck"],
  },
  {
    id: "c3",
    day: 2,
    time: "Dawn",
    name: "Kotka",
    x: 58,
    y: 44,
    icon: "bird",
    desc: "Pre-dawn private canoe through tidal canals. Just the two of you, your guide, and a forest waking up.",
    highlights: [
      "Private canoe glide",
      "Birdwatching at dawn",
      "Couples breakfast on deck",
      "Naturalist-led trek",
    ],
  },
  {
    id: "c4",
    day: 2,
    time: "Evening",
    name: "Dublar Char",
    x: 76,
    y: 56,
    icon: "waves",
    desc: "Anchor off Dublar Char. Couples spa ritual on the deck followed by a beach bonfire dinner.",
    highlights: [
      "Couples spa ritual",
      "Bonfire on the sand",
      "Bay of Bengal sunset",
      "Star-bath jacuzzi",
    ],
  },
  {
    id: "c5",
    day: 3,
    time: "Morning",
    name: "Return — Khulna",
    x: 14,
    y: 12,
    icon: "anchor",
    desc: "Slow morning sail back through the mangrove. Brunch on deck, farewell gift, and a portrait keepsake from your voyage.",
    highlights: [
      "Brunch on deck",
      "Couples portrait shoot",
      "Farewell gift box",
      "Return at midday",
    ],
  },
];

const family: Stop[] = [
  {
    id: "f1",
    day: 1,
    time: "Morning",
    name: "Khulna",
    x: 12,
    y: 8,
    icon: "anchor",
    desc: "Family-suite check-in with a kids' welcome kit, scavenger map and junior naturalist badge.",
    highlights: ["Family suite", "Kids' adventure kit", "Sky-deck welcome", "Family briefing"],
  },
  {
    id: "f2",
    day: 1,
    time: "Afternoon",
    name: "Karamjal",
    x: 32,
    y: 28,
    icon: "trees",
    desc: "Karamjal wildlife center — kids meet rescued crocodiles and spotted deer with our resident naturalist.",
    highlights: [
      "Wildlife center tour",
      "Junior naturalist activity",
      "Family canoe ride",
      "BBQ deck dinner",
    ],
  },
  {
    id: "f3",
    day: 2,
    time: "Morning",
    name: "Andharmanik",
    x: 56,
    y: 42,
    icon: "bird",
    desc: "Andharmanik canal cruise — narrow tidal channels, kingfishers and macaques along the riverbank.",
    highlights: [
      "Canal expedition",
      "Kingfisher photo stop",
      "Forest watchtower climb",
      "Family picnic lunch",
    ],
  },
  {
    id: "f4",
    day: 2,
    time: "Evening",
    name: "Kotka Meadow",
    x: 70,
    y: 52,
    icon: "sun",
    desc: "Open meadow safari at Kotka. Family stargazing event on the upper deck with a night-sky guide.",
    highlights: [
      "Open meadow walk",
      "Stargazing night",
      "Family movie deck",
      "Storytelling session",
    ],
  },
  {
    id: "f5",
    day: 3,
    time: "Morning",
    name: "Return — Khulna",
    x: 14,
    y: 12,
    icon: "anchor",
    desc: "Sail home with a farewell breakfast, family portrait and printed scrapbook of the voyage.",
    highlights: ["Farewell breakfast", "Family portrait", "Printed scrapbook", "Disembarkation"],
  },
];

const photo: Stop[] = [
  {
    id: "p1",
    day: 1,
    time: "Morning",
    name: "Khulna",
    x: 12,
    y: 8,
    icon: "anchor",
    desc: "Pre-trip gear briefing with the resident wildlife photographer. Lens recommendations and shot list.",
    highlights: ["Gear briefing", "Pro photo guide", "Suite check-in", "Editing lounge access"],
  },
  {
    id: "p2",
    day: 1,
    time: "Sunset",
    name: "Kochikhali",
    x: 32,
    y: 26,
    icon: "camera",
    desc: "Golden-hour shoot at Kochikhali. Wide deltas, silhouetted boats and a working fishing village.",
    highlights: [
      "Golden-hour shoot",
      "Fishing village access",
      "Drone permits arranged",
      "Naturalist guide",
    ],
  },
  {
    id: "p3",
    day: 2,
    time: "Pre-dawn",
    name: "Kotka Hide",
    x: 52,
    y: 42,
    icon: "bird",
    desc: "Pre-dawn departure to a hidden tiger blind. Long-lens session for tiger pugmarks, deer and rare birds.",
    highlights: [
      "Tiger-tracking blind",
      "Long-lens session",
      "Bird inventory walk",
      "Brunch on return",
    ],
  },
  {
    id: "p4",
    day: 3,
    time: "Sunrise",
    name: "Hiron Point",
    x: 70,
    y: 50,
    icon: "sun",
    desc: "Sunrise photography at Hiron Point — the only protected zone where sambar deer feed at the water's edge.",
    highlights: [
      "Hiron Point sunrise",
      "Sambar deer at shore",
      "Estuary panoramas",
      "Editing review",
    ],
  },
  {
    id: "p5",
    day: 4,
    time: "Morning",
    name: "Return — Khulna",
    x: 14,
    y: 12,
    icon: "anchor",
    desc: "Sail home with a guided edit session and a curated portfolio review with the on-board photographer.",
    highlights: [
      "Portfolio review",
      "Editing master-class",
      "Print of best shot",
      "Disembarkation",
    ],
  },
];

const fallbackTemplate: MarketingTemplate = {
  img: deck,
  tag: "Sundarbans Voyage",
  inc: ["Cabin accommodation", "All meals", "Forest excursions", "Naturalist guide"],
  itinerary: signature,
};

const templatesByTitle: Record<string, MarketingTemplate> = {
  "Sundarbans Explorer": {
    img: deck,
    tag: "Most loved",
    inc: ["Private balcony cabin", "All meals + BBQ night", "Forest trekking", "Naturalist guide"],
    itinerary: signature,
  },
  "Couple's Escape": {
    img: cabin,
    tag: "Romantic",
    inc: ["Honeymoon suite", "Candlelit deck dinner", "Private canoe ride", "Spa treatment"],
    itinerary: couples,
  },
  "Family Discovery": {
    img: canal,
    tag: "Family",
    inc: ["Family suite", "Kids activities", "Forest watchtower", "Educational tours"],
    itinerary: family,
  },
  "Corporate Retreat": {
    img: dining,
    tag: "Corporate",
    inc: ["Conference deck", "Full A/V setup", "Branded experience", "Group dining"],
    itinerary: signature,
  },
  "Photographer's Expedition": {
    img: deck,
    tag: "Wildlife",
    inc: ["Tiger tracking", "Pre-dawn excursions", "Pro photo guide", "Hide blinds"],
    itinerary: photo,
  },
};

function templateFor(pkg: Package): MarketingTemplate {
  return templatesByTitle[pkg.marketing_title] ?? fallbackTemplate;
}

const destinations = [
  "Andharmanik",
  "Kotka",
  "Jamtola Sea Beach",
  "Hiron Point",
  "Dublar Char",
  "Karamjal",
  "Kochikhali",
  "Dim Char",
];

function PackagesPage() {
  const { data: packages, isLoading, isError } = usePackages();
  const packageList = Array.isArray(packages) ? packages : [];

  return (
    <>
      <PageHero
        eyebrow="Curated Voyages"
        title={
          <>
            Choose your <em className="not-italic">cinematic</em> 3 days.
          </>
        }
        subtitle="Hand-crafted itineraries through the most iconic corners of Sundarbans — each with an interactive day-by-day route map, on real upcoming sailing dates."
        image={deck}
      />

      <section className="py-16 bg-background border-b border-border">
        <div className="container-luxe">
          <div className="eyebrow text-gold mb-6">Destinations on every voyage</div>
          <div className="flex flex-wrap gap-3">
            {destinations.map((d) => (
              <span
                key={d}
                className="px-5 py-2.5 rounded-full border border-border text-sm flex items-center gap-2"
              >
                <MapPin className="size-3.5 text-gold" /> {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-background space-y-24 md:space-y-32">
        {isLoading && (
          <div className="container-luxe flex items-center justify-center gap-3 text-muted-foreground py-20">
            <Loader2 className="size-5 animate-spin" /> Loading upcoming voyages…
          </div>
        )}
        {isError && (
          <div className="container-luxe text-center py-20 text-muted-foreground">
            Couldn't load voyages right now — please try again shortly.
          </div>
        )}
        {!isLoading && !isError && packageList.length === 0 && (
          <div className="container-luxe text-center py-20 text-muted-foreground">
            No voyages are currently open for booking. Please check back soon.
          </div>
        )}
        {packageList.map((pkg, i) => {
          const tpl = templateFor(pkg);
          const title = pkg.marketing_title || `${pkg.ship.name} Voyage`;
          const itineraryId = `pkg-${pkg.id}-itinerary`;
          return (
            <div key={pkg.id} className="container-luxe">
              <div className="max-w-md mx-auto mb-10">
                <PackageCard
                  pkg={pkg}
                  index={i}
                  itineraryHref={`#${itineraryId}`}
                  fallbackImage={tpl.img}
                />
              </div>

              <div id={itineraryId} className="mt-12 scroll-mt-28">
                <SectionHeader
                  eyebrow="Day-by-day route"
                  title={
                    <>
                      Tap any stop. <em className="not-italic">See the day unfold.</em>
                    </>
                  }
                />
                <div className="mt-10">
                  <ItineraryMap
                    stops={tpl.itinerary}
                    title={title}
                    paramKey={PKG_KEYS[i] ?? `pkg${i}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <CTA />
    </>
  );
}
