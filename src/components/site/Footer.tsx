import { Link } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Ticket,
  ShieldCheck,
} from "lucide-react";
import logo from "@/assets/logo.png";
import paymentBanner from "@/assets/sslcommerz-payment-banner.jpg";
import { COMPANY, branchAddress, registeredAddress, registrationRows } from "@/lib/company";

/** SSLCommerz merchant compliance requires all three policies, About Us, the
 *  registered address and the trade licence number to be reachable from the
 *  footer, alongside their payment banner — so this component is where those
 *  obligations are met. Changing a link here without checking that list is how
 *  the merchant account gets suspended. */
const POLICY_LINKS: [string, string][] = [
  ["Terms & Conditions", "/terms"],
  ["Privacy Policy", "/privacy"],
  ["Refund & Delivery Policy", "/refund-policy"],
  ["Payment & Cancellation", "/policy"],
  ["Contact Us", "/contact"],
];

const EXPLORE_LINKS: [string, string][] = [
  ["About Us", "/about"],
  ["Cabins", "/cabins"],
  ["Packages", "/packages"],
  ["Wildlife", "/wildlife"],
  ["Dining", "/dining"],
  ["Gallery", "/gallery"],
];

const SOCIALS = [
  {
    Icon: Facebook,
    href: "https://www.facebook.com/profile.php?id=100093297079777",
    label: "MV THE CROWN on Facebook",
  },
  { Icon: Instagram, href: "#", label: "MV THE CROWN on Instagram" },
  { Icon: Youtube, href: "#", label: "MV THE CROWN on YouTube" },
];

export function Footer() {
  const registration = registrationRows();

  return (
    <footer className="relative gradient-ocean text-background">
      <div className="gold-rule" />

      <div className="container-luxe py-20 grid gap-14 lg:grid-cols-12">
        {/* ── Brand ── */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-4">
            <img src={logo} alt="MV THE CROWN" className="h-20 w-auto object-contain" />
            <div className="leading-none">
              <div className="font-display text-3xl tracking-widest font-bold">MV THE CROWN</div>
              <div className="eyebrow text-gold-soft text-[10px] mt-1 tracking-[0.2em]">
                Cruise Ship
              </div>
            </div>
          </div>
          <p className="mt-6 text-sm text-background/65 leading-relaxed max-w-sm">
            The premium brand for river cruising. Bangladesh's most luxurious government-approved
            Sundarbans cruise — where adventure meets elegance.
          </p>
          {/* Icon-only links carry no text, so each needs an explicit accessible
              name — without one a screen reader announces only "link". */}
          <div className="mt-6 flex gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="size-10 rounded-full border border-white/15 grid place-items-center hover:border-gold hover:text-gold transition-colors"
              >
                <Icon aria-hidden="true" className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Policies ── */}
        <div className="lg:col-span-3">
          <div className="eyebrow text-gold mb-5">Policies</div>
          <ul className="space-y-3 text-sm text-background/75">
            {POLICY_LINKS.map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="hover:text-gold transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Explore ── */}
        <div className="lg:col-span-2">
          <div className="eyebrow text-gold mb-5">Explore</div>
          <ul className="space-y-3 text-sm text-background/75">
            {EXPLORE_LINKS.map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="hover:text-gold transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Reservations ── */}
        <div className="lg:col-span-3">
          <div className="eyebrow text-gold mb-5">Reservations</div>
          <ul className="space-y-3 text-sm text-background/75">
            {COMPANY.support.phones.map((phone) => (
              <li key={phone} className="flex items-center gap-3">
                <Phone aria-hidden="true" className="size-4 text-gold shrink-0" />
                <a
                  href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                  className="hover:text-gold transition-colors"
                >
                  {phone}
                </a>
              </li>
            ))}
            {COMPANY.support.emails.map((email) => (
              <li key={email} className="flex items-center gap-3">
                <Mail aria-hidden="true" className="size-4 text-gold shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-gold transition-colors break-all">
                  {email}
                </a>
              </li>
            ))}
            {/* Where a customer who has already booked comes back to: cabins,
                dates, invoices and cancellation, from a booking code. */}
            <li className="flex items-center gap-3 pt-2">
              <Ticket aria-hidden="true" className="size-4 text-gold shrink-0" />
              <Link
                to="/manage"
                className="text-gold-soft hover:text-gold transition-colors border-b border-gold/40 pb-0.5"
              >
                Manage your booking
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Offices ──
          The registered address is labelled separately because SSLCommerz
          checks it against the trade licence; the branch is just an office. */}
      <div className="border-t border-white/8">
        <div className="container-luxe py-8 grid gap-6 sm:grid-cols-2">
          <div>
            <div className="eyebrow text-gold mb-3 text-[10px]">Registered Office</div>
            <div className="flex items-start gap-3 text-sm text-background/75">
              <MapPin aria-hidden="true" className="size-4 text-gold shrink-0 mt-0.5" />
              <address className="not-italic">{registeredAddress}</address>
            </div>
          </div>
          <div>
            <div className="eyebrow text-gold mb-3 text-[10px]">Dhaka Office</div>
            <div className="flex items-start gap-3 text-sm text-background/75">
              <MapPin aria-hidden="true" className="size-4 text-gold shrink-0 mt-0.5" />
              <address className="not-italic">{branchAddress}</address>
            </div>
          </div>
        </div>
      </div>

      {/* ── SSLCommerz payment banner ──
          Intrinsic size is declared so the strip reserves its height before the
          image loads; without it the whole legal block below shifts. */}
      <div className="border-t border-white/8 bg-white">
        <div className="container-luxe py-6">
          <div className="eyebrow text-ocean/50 text-[10px] mb-3">Accepted payment methods</div>
          <img
            src={paymentBanner}
            alt="Pay with Visa, Mastercard, American Express, bKash, Nagad, Rocket, Upay and all major Bangladeshi bank cards and mobile wallets — verified by SSLCommerz"
            width={1280}
            height={143}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      </div>

      {/* ── Legal strip: licence numbers + payment-security note ── */}
      <div className="border-t border-white/8">
        <div className="container-luxe py-5 flex flex-col lg:flex-row gap-4 lg:items-center justify-between text-xs text-background/60">
          <div className="flex items-start gap-2 max-w-xl">
            <ShieldCheck aria-hidden="true" className="size-4 text-gold shrink-0 mt-px" />
            <span>
              Payments are processed by SSLCommerz over an encrypted connection. We never see or
              store your card details.
            </span>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {registration.map(({ label, value }) => (
              <span key={label}>
                {label} <strong className="text-background/85">{value}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="border-t border-white/8">
        <div className="container-luxe py-6 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-background/50">
          <div>
            © {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/about" className="hover:text-gold">
              About Us
            </Link>
            <Link to="/packages" className="hover:text-gold">
              Packages
            </Link>
            <Link to="/manage" className="hover:text-gold">
              Manage Booking
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
