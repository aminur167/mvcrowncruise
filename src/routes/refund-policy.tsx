import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PolicyPage, type PolicySection } from "@/components/site/PolicyPage";
import { useCancellationPolicy } from "@/hooks/queries/useCancellation";
import { REFUND_SLA_FALLBACK_DAYS } from "@/lib/company";
import ship from "@/assets/ship-on-the-river.jpg";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPolicy,
  head: () => ({
    meta: [
      { title: "Refund & Delivery Policy — MV THE CROWN" },
      {
        name: "description",
        content:
          "How to cancel an MV THE CROWN booking, what it costs, how long a refund takes, and what you receive after paying.",
      },
    ],
  }),
});

/** Fallback only — the live table comes from the API, which is also what the
 *  cancellation charge is computed from. Kept in step with the seeded default
 *  schedule (refunds/migrations/0002) so an unreachable API never leaves this
 *  page printing an empty contract. */
const FALLBACK_TIERS: [string, string, string][] = [
  ["3 weeks before departure", "5%", "15%"],
  ["2 weeks before departure", "15%", "20%"],
  ["1 week before departure", "35%", "25%"],
  ["3 days before departure", "50%", "50%"],
  ["48 hours before departure", "75%", "70%"],
  ["24 hours before departure", "90%", "90%"],
  ["Less than 24 hours before departure", "100%", "100%"],
];

const percent = (value: string) => `${Number.parseFloat(value)}%`;

function ChargeTable({ tiers }: { tiers: [string, string, string][] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden overflow-x-auto my-4">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr className="bg-secondary/60 text-left">
            <th className="px-5 py-3 eyebrow text-[10px] font-semibold">When cancelled</th>
            <th className="px-5 py-3 eyebrow text-[10px] font-semibold">Individual</th>
            <th className="px-5 py-3 eyebrow text-[10px] font-semibold">Group</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map(([when, individual, group]) => (
            <tr key={when} className="border-t border-border">
              <td className="px-5 py-3">{when}</td>
              <td className="px-5 py-3 font-semibold text-foreground">{individual}</td>
              <td className="px-5 py-3 font-semibold text-foreground">{group}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function buildSections(tiers: [string, string, string][], slaDays: number): PolicySection[] {
  return [
    {
      title: "What you receive, and when",
      body: (
        <>
          <p>
            A cruise is a service, so there is nothing to ship. What is “delivered” is your
            reservation and the documents that prove it:
          </p>
          <ul>
            <li>
              <strong>Immediately</strong> — on completing the booking you are given your booking
              code on screen, and your cabin is held for you.
            </li>
            <li>
              <strong>Within a few minutes of payment</strong> — a confirmation email with a PDF
              invoice showing your cabins, guests, the amount paid and anything still due. If it has
              not arrived, check your spam folder, then contact us.
            </li>
            <li>
              <strong>At any time afterwards</strong> — you can reopen your booking and re-download
              your invoice from{" "}
              <Link to="/manage" className="text-gold-text underline underline-offset-2">
                Manage booking
              </Link>{" "}
              using your booking code and the last four digits of your phone number.
            </li>
            <li>
              <strong>Before departure</strong> — we contact you with the boarding point, reporting
              time and what to bring.
            </li>
            <li>
              <strong>On the day</strong> — board at the announced departure point with your booking
              code and a photo ID for each adult guest. Foreign nationals should carry the passport
              used at booking.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "How to cancel",
      body: (
        <>
          <ul>
            <li>
              Open{" "}
              <Link to="/manage" className="text-gold-text underline underline-offset-2">
                Manage booking
              </Link>{" "}
              and enter your booking code and the last four digits of your phone number. Before you
              confirm anything you are shown the exact cancellation charge and the exact refund due.
            </li>
            <li>
              Tell us why. Your refund goes back to the card or mobile wallet you paid with, so
              there is nothing else to fill in — unless you would rather have it somewhere else,
              which you can ask for on the same screen.
            </li>
            <li>
              Submit. You will receive an acknowledgement email straight away, and{" "}
              <strong>your cabin stays held</strong> until our team reviews the request.
            </li>
            <li>
              We review every request, normally within one working day, and email you the decision
              either way.
            </li>
          </ul>
          <p>
            If you prefer, call our reservations desk and we will do it for you. The figures quoted
            to you are fixed at the moment you submit — they do not change while we are reviewing,
            even if a deadline passes in the meantime.
          </p>
        </>
      ),
    },
    {
      title: "What a cancellation costs",
      body: (
        <>
          <p>
            Charges are a percentage of the total booking amount, based on how close to departure
            you cancel.
          </p>
          <ChargeTable tiers={tiers} />
          <p>
            Whatever remains after the charge is refunded to you. If the cancellation charge comes
            to more than you have actually paid, we keep what was paid and bill you for nothing
            further.
          </p>
          <p>
            Once a departure has begun, online cancellation closes and no refund is due — please
            call us if something has gone wrong. A guest who does not board is treated as a no-show.
          </p>
        </>
      ),
    },
    {
      title: "If we cancel the sailing",
      body: (
        <p>
          If we cancel a sailing — bad weather, a technical problem with the vessel, or the total
          number of passengers falling below the minimum required —{" "}
          <strong>no cancellation charge applies and you are refunded in full</strong>, or you may
          move your booking to another departure. This is our decision, not yours, so you are never
          charged for it.
        </p>
      ),
    },
    {
      title: "How long a refund takes",
      body: (
        <>
          <p>
            Once approved, your refund is reversed through our payment gateway back to the card or
            mobile wallet you paid with, and reaches you{" "}
            <strong>within {slaDays} working days</strong>. That window is end to end — it covers
            your bank or wallet provider's own processing as well as ours.
          </p>
          <p>
            We email you a confirmation with the transaction reference as soon as the refund is sent
            — quote it back to us if it has not reached you.
          </p>
          <p>
            If you asked us to pay you somewhere else instead, or your payment cannot be reversed
            for any reason, we send it by bKash, Nagad or bank transfer to the account you gave us,
            within the same window.
          </p>
        </>
      ),
    },
    {
      title: "Overpayments and duplicate charges",
      body: (
        <p>
          If you are ever overcharged, or a payment is taken twice, the full amount is returned to
          you — the cancellation charges above do not apply, because that money was never ours.
          Contact us and we will settle it.
        </p>
      ),
    },
    {
      title: "Prices, taxes and payment methods",
      body: (
        <p>
          All prices are exclusive of VAT &amp; TAX, and additional government revenue charges apply
          for foreign guests; these are refunded only where the authority itself refunds them.
          Payment is accepted online through SSLCommerz — bKash, Nagad, mobile banking, internet
          banking and debit cards. Full terms are in our{" "}
          <Link to="/terms" className="text-gold-text underline underline-offset-2">
            Terms &amp; Conditions
          </Link>
          .
        </p>
      ),
    },
  ];
}

function RefundPolicy() {
  const { data } = useCancellationPolicy();
  const tiers: [string, string, string][] = data?.tiers.length
    ? data.tiers.map((tier) => [
        tier.label,
        percent(tier.individual_percent),
        percent(tier.group_percent),
      ])
    : FALLBACK_TIERS;
  // The quoted window is per-ship and set in the admin — the same figure the
  // cancellation email promises, so the page can never contradict the email.
  const slaDays = data?.refund_sla_days ?? REFUND_SLA_FALLBACK_DAYS;

  return (
    <PolicyPage
      hero={
        <PageHero
          eyebrow="Refunds & delivery"
          title={
            <>
              Refund &amp; delivery <em className="not-italic">policy.</em>
            </>
          }
          subtitle="What you receive after booking, how to cancel, what it costs, and when the money comes back."
          image={ship}
        />
      }
      intro="We would rather you knew exactly where you stand before you pay than discover it afterwards. This page states what a cancellation costs, how to request one, and how long a refund takes."
      sections={buildSections(tiers, slaDays)}
    />
  );
}
