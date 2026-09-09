import type { ReactNode } from "react";
import { COMPANY, registeredAddress, supportEmail } from "@/lib/company";

export type PolicySection = {
  title: string;
  body: ReactNode;
};

/** Shared shell for the three legal pages (Terms, Privacy, Refund & Delivery).
 *
 *  They exist because SSLCommerz requires them, and SSLCommerz reads them: the
 *  operating company, its registered address and its trade licence have to be
 *  identifiable on each one, not only in the footer. Keeping the three pages in
 *  one component is what stops that block drifting apart between them.
 *
 *  Section bodies are plain prose — the `[&_ul]` rules below style the lists
 *  and bold runs each section writes, so a section stays readable JSX instead
 *  of carrying a class on every element. */
export function PolicyPage({
  hero,
  intro,
  sections,
  children,
}: {
  hero: ReactNode;
  intro: ReactNode;
  sections: PolicySection[];
  /** Rendered between the intro and the numbered sections — used by the refund
   *  page for its charge table, which is data rather than prose. */
  children?: ReactNode;
}) {
  return (
    <>
      {hero}

      <section className="py-24 md:py-32 bg-background">
        <div className="container-luxe max-w-3xl">
          <div className="eyebrow text-gold-text text-[10px]">
            Last updated · {COMPANY.policiesUpdated}
          </div>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{intro}</p>

          {children}

          <div className="mt-14 space-y-12">
            {sections.map((section, i) => (
              <section key={section.title}>
                <h2 className="font-display text-xl md:text-2xl font-light leading-tight">
                  <span className="text-gold-text mr-2.5">{String(i + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                <div className="mt-3 text-sm text-muted-foreground leading-relaxed space-y-3 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          {/* Operator block — SSLCommerz expects an identifiable company behind
              each policy, with the trade licence number on the page. */}
          <div className="mt-16 rounded-2xl border border-border bg-card shadow-luxe p-8">
            <div className="eyebrow text-gold-text text-[10px] mb-4">Contact us</div>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
              <div className="font-semibold text-foreground">{COMPANY.legalName}</div>
              <address className="not-italic">{registeredAddress}</address>
              <div>Trade Licence No. {COMPANY.registration.tradeLicence}</div>
              <div>
                Email:{" "}
                <a href={`mailto:${supportEmail}`} className="text-foreground hover:text-gold-text">
                  {supportEmail}
                </a>
              </div>
              <div>Phone: {COMPANY.support.phones.join(" · ")}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
