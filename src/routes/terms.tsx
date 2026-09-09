import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PolicyPage, type PolicySection } from "@/components/site/PolicyPage";
import { COMPANY, registeredAddress, supportEmail } from "@/lib/company";
import deck from "@/assets/deck-sunset.jpg";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () => ({
    meta: [
      { title: "Terms & Conditions — MV THE CROWN" },
      {
        name: "description",
        content:
          "The terms on which MV THE CROWN sells and operates Sundarbans cruise packages booked through this website.",
      },
    ],
  }),
});

const SECTIONS: PolicySection[] = [
  {
    title: "Who we are",
    body: (
      <p>
        This website is operated by <strong>{COMPANY.legalName}</strong>, of {registeredAddress},
        trading as {COMPANY.brandName}. “We” and “us” mean that company. “You” means anyone using
        this website or making a booking. A “booking” is a reservation for one or more cabins on a
        specified departure.
      </p>
    ),
  },
  {
    title: "Use of this website",
    body: (
      <>
        <p>
          You must be 18 or over to make a booking, and the details you give us must be accurate.
          The lead guest is responsible for the whole booking, including everyone travelling on it.
        </p>
        <ul>
          <li>
            Each cabin has a maximum number of adults and children. These limits come from the cabin
            type and are enforced when you book.
          </li>
          <li>
            Children's fares depend on age. You must give each child's correct age — an incorrect
            age changes the fare and may be corrected at boarding.
          </li>
          <li>
            The photographs, text and video on this site belong to us and may not be reproduced
            commercially without permission.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Making a booking",
    body: (
      <>
        <p>
          A booking is only confirmed once the required payment has been received and we have
          emailed your confirmation. Choosing a cabin without paying does not reserve it.
        </p>
        <p>
          Online booking for a departure closes automatically at{" "}
          <strong>12:00 PM (noon) on the day before the tour start date</strong>. After that, please
          contact our reservations desk.
        </p>
        <p>
          Foreign nationals must give the passport details required for Sundarbans entry permits
          before boarding.
        </p>
      </>
    ),
  },
  {
    title: "Prices and payment",
    body: (
      <>
        <p>
          All prices are in Bangladeshi Taka (BDT). The fare shown at checkout is the total for your
          booking, calculated by us from the cabin, the number of guests and their ages, and any
          applicable foreign-national surcharge. Prices may change for future departures, but never
          for a booking already made.
        </p>
        <p>
          Payments are processed by <strong>SSLCommerz</strong>. You may pay in full, or pay a
          deposit and settle the balance before departure — online, or in cash to our guide on
          board. Any outstanding balance must be settled before or at boarding.
        </p>
        <p>
          Prices are exclusive of VAT &amp; TAX. Additional government revenue charges apply for
          foreign guests.
        </p>
      </>
    ),
  },
  {
    title: "Cancellations and refunds",
    body: (
      <p>
        Cancellations, cancellation charges and refund timelines are set out in full in our{" "}
        <Link to="/refund-policy" className="text-gold-text underline underline-offset-2">
          Refund &amp; Delivery Policy
        </Link>
        , which forms part of these terms.
      </p>
    ),
  },
  {
    title: "Changes we may have to make",
    body: (
      <p>
        Cruising depends on conditions we do not control. Where bad weather, a technical problem
        with the vessel, an instruction from the authorities, or the number of passengers falling
        below the minimum required makes a sailing unsafe or unviable, we may cancel, reschedule or
        alter the itinerary. If we cancel a departure you are{" "}
        <strong>refunded in full or moved to another sailing, at your choice</strong>. Minor changes
        to the route or the on-board programme do not entitle you to a refund.
      </p>
    ),
  },
  {
    title: "On board: your responsibilities",
    body: (
      <ul>
        <li>
          Arrive at the announced departure point on time. We cannot delay a sailing for late
          guests, and a missed departure is treated as a no-show.
        </li>
        <li>
          Follow the instructions of the captain, crew and guides at all times. They are responsible
          for your safety, and for the vessel.
        </li>
        <li>
          Shore excursions take place only in permitted areas, with licensed guides and armed forest
          guards. Leaving the group is not permitted.
        </li>
        <li>
          Behave considerately toward other guests. We may refuse boarding to, or disembark, anyone
          whose conduct endangers or seriously disturbs others, without refund.
        </li>
        <li>
          The Sundarbans is a protected reserve. Do not disturb wildlife or leave waste behind.
        </li>
      </ul>
    ),
  },
  {
    title: "Health, safety and insurance",
    body: (
      <p>
        River cruising in a mangrove forest involves the ordinary risks of boats, water and remote
        locations. Please tell us in advance about any medical condition, mobility need or dietary
        requirement so we can prepare. We recommend travel insurance. Guests travel at their own
        risk in respect of pre-existing conditions.
      </p>
    ),
  },
  {
    title: "Your belongings",
    body: (
      <p>
        Please look after your own valuables. We are not responsible for personal property lost,
        damaged or left behind on board, except where caused by our negligence. Guests are
        responsible for damage they cause to the vessel.
      </p>
    ),
  },
  {
    title: "Our liability",
    body: (
      <p>
        We provide our services with reasonable care and skill. Our liability for any claim arising
        out of a booking is limited to the amount you paid for that booking, except where the law
        does not allow such a limit. We are not liable for losses caused by events beyond our
        reasonable control — weather, natural events, government action or restrictions on the
        waterways.
      </p>
    ),
  },
  {
    title: "Privacy",
    body: (
      <p>
        How we handle your personal information, including payment security and cookies, is
        described in our{" "}
        <Link to="/privacy" className="text-gold-text underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
    ),
  },
  {
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of Bangladesh, and any dispute is subject to the
        jurisdiction of the courts of Bangladesh.
      </p>
    ),
  },
  {
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. The version published on this page is the one
        in force, and the date above shows when it last changed. A booking is governed by the terms
        in force when it was made. Questions: <strong>{supportEmail}</strong>.
      </p>
    ),
  },
];

function Terms() {
  return (
    <PolicyPage
      hero={
        <PageHero
          eyebrow="Terms & Conditions"
          title={
            <>
              Terms &amp; <em className="not-italic">conditions.</em>
            </>
          }
          subtitle="The agreement between you and us when you book a voyage through this website."
          image={deck}
        />
      }
      intro="Please read these terms before booking. By using this website or making a booking you agree to them. If you do not agree, please do not use the site."
      sections={SECTIONS}
    />
  );
}
