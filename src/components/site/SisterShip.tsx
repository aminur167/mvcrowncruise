import { motion } from "framer-motion";
import { Anchor, ArrowUpRight } from "lucide-react";
import sisterShipImage from "@/assets/M.V._ALASKA_AboutPageImage.jpeg";

// Our sister ship's own, separately hosted site — an external link, not a
// route in this app.
const SISTER_SHIP_URL = "https://www.mvalaskacruise.com/";

export function SisterShip() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-border shadow-luxe grid md:grid-cols-2"
        >
          <div className="relative h-56 md:h-auto">
            <img
              src={sisterShipImage}
              alt="MV Alaska Cruise sailing the Sundarbans"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ocean/70 via-ocean/10 to-transparent md:bg-linear-to-r md:from-transparent md:via-transparent md:to-ocean/15" />
          </div>
          <div className="p-10 md:p-14 flex flex-col justify-center bg-card">
            <div className="eyebrow text-gold-text mb-4 flex items-center gap-2">
              <Anchor className="size-3.5" /> Same Company, Another Ship
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-light leading-tight">
              Sailing elsewhere? Meet <em className="not-italic">MV Alaska Cruise.</em>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">
              From the same team behind MV THE CROWN — explore MV Alaska Cruise's own voyages,
              cabins, and departures on their dedicated website.
            </p>
            <a
              href={SISTER_SHIP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 self-start px-7 py-3.5 rounded-full border border-gold/50 text-gold-text text-xs uppercase tracking-[0.18em] font-semibold hover:bg-gold hover:text-ocean transition-colors"
            >
              Visit MV Alaska Cruise <ArrowUpRight className="size-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
