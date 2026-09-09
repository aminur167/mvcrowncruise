import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageHero";
import { PolicyPage, type PolicySection } from "@/components/site/PolicyPage";
import { COMPANY, registeredAddress } from "@/lib/company";
import canal from "@/assets/canal-mangrove.jpg";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "Privacy Policy — MV THE CROWN" },
      {
        name: "description",
        content:
          "How MV THE CROWN collects, uses and protects your personal information, including payment security and our use of cookies.",
      },
    ],
  }),
});

const SECTIONS: PolicySection[] = [
  {
    title: "Information we collect",
    body: (
      <>
        <p>We only ask for what a booking actually requires.</p>
        <ul>
          <li>
            <strong>Booking details</strong> — your name, mobile number and email address, the
            cabins you choose, and how many adults and children are travelling.
          </li>
          <li>
            <strong>Children's ages</strong> — needed because fares are age-based. We do not collect
            anything else about a child.
          </li>
          <li>
            <strong>Passport details of foreign nationals</strong> — the passport number and
            nationality of each non-Bangladeshi guest, required by the Forest Department for entry
            permits into the Sundarbans. We collect these only for guests you identify as foreign
            nationals.
          </li>
          <li>
            <strong>Special requests</strong> — anything you tell us voluntarily (dietary needs,
            accessibility, an anniversary).
          </li>
          <li>
            <strong>Refund account details</strong> — if you cancel, the account you ask us to send
            the money to.
          </li>
          <li>
            <strong>Technical data</strong> — your IP address and basic browser information,
            recorded automatically so we can keep the site secure and working.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Payment security",
    body: (
      <>
        <p>
          Payments are processed by <strong>SSLCommerz</strong>, a PCI-DSS compliant gateway
          licensed by Bangladesh Bank. Your card number, expiry date, CVV, PIN and OTP are entered
          on the gateway's own secure page.{" "}
          <strong>We never see, handle or store your card or wallet details.</strong>
        </p>
        <p>
          All traffic to this site is encrypted with HTTPS/TLS. What comes back to us from the
          gateway is confined to what we need to run your booking: whether the payment succeeded,
          the amount, and a transaction reference. Every payment is verified directly with the
          gateway before a booking is marked paid, so a payment result cannot be forged by anyone in
          between.
        </p>
        <p>
          Your booking is reached by an unguessable booking code, and anything that moves money — a
          cancellation or a refund request — additionally asks for the last four digits of the phone
          number on the booking.
        </p>
        <p>
          We will never ask you for your card details, PIN or OTP by phone, email, SMS or WhatsApp.
          If anyone claiming to represent us does, do not share them, and tell us at once.
        </p>
      </>
    ),
  },
  {
    title: "How we use your information",
    body: (
      <>
        <ul>
          <li>To create, confirm and manage your booking.</li>
          <li>
            To send you booking confirmations, invoices, payment reminders and cancellation or
            refund notices.
          </li>
          <li>
            To prepare the passenger list our crew uses on board, and the manifest required by the
            authorities.
          </li>
          <li>To answer your enquiries and provide customer support.</li>
          <li>To meet our legal, tax and accounting obligations, and to prevent fraud.</li>
        </ul>
        <p>
          We do not send marketing messages to people who have only made a booking, and{" "}
          <strong>we never sell or rent your personal information.</strong>
        </p>
      </>
    ),
  },
  {
    title: "Cookies and local storage",
    body: (
      <>
        <p>
          A cookie is a small file a website stores in your browser. We keep our use of them
          deliberately narrow:
        </p>
        <ul>
          <li>
            <strong>Essential cookies and local storage</strong> — these keep your booking progress
            as you move through the steps, and keep staff signed in to the dashboard. The site
            cannot function without them.
          </li>
          <li>
            <strong>Payment gateway cookies</strong> — set by SSLCommerz during checkout, to carry
            your payment session securely.
          </li>
        </ul>
        <p>
          We do not use advertising or cross-site tracking cookies. You can delete or block cookies
          in your browser settings, but blocking the essential ones will stop the booking and
          payment process from completing.
        </p>
      </>
    ),
  },
  {
    title: "Who we share it with",
    body: (
      <>
        <p>We share your information only where a booking cannot happen without it:</p>
        <ul>
          <li>
            <strong>SSLCommerz</strong> — to take your payment and, where applicable, to process a
            refund.
          </li>
          <li>
            <strong>Our email provider</strong> — to deliver your confirmation and invoice.
          </li>
          <li>
            <strong>Our crew and guides</strong> — the passenger list for your sailing.
          </li>
          <li>
            <strong>The authorities</strong> — where the law or maritime regulations require it,
            such as the passenger manifest and Forest Department entry permits.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "How we protect it",
    body: (
      <p>
        Booking records are held in an access-controlled database that only authorised staff can
        reach. Passport numbers are masked everywhere they are shown back to a customer, including
        on your own booking page. Files that contain personal data — your invoices in particular —
        are kept in private storage and served through links that expire, not from publicly
        guessable addresses.
      </p>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <p>
        Booking, payment and invoice records are kept for as long as tax and accounting law
        requires. Enquiries and messages are kept only while they are useful for supporting you, and
        are then deleted.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <p>
        You may ask us for a copy of the information we hold about you, ask us to correct anything
        that is wrong, or ask us to delete what we are not legally required to keep. Contact us
        using the details below and we will respond as quickly as we can.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: (
      <p>
        If we change this policy we will update the date at the top of this page. Material changes
        will be highlighted here. See also our{" "}
        <Link to="/terms" className="text-gold-text underline underline-offset-2">
          Terms &amp; Conditions
        </Link>{" "}
        and{" "}
        <Link to="/refund-policy" className="text-gold-text underline underline-offset-2">
          Refund &amp; Delivery Policy
        </Link>
        .
      </p>
    ),
  },
];

function Privacy() {
  return (
    <PolicyPage
      hero={
        <PageHero
          eyebrow="Privacy Policy"
          title={
            <>
              Privacy <em className="not-italic">policy.</em>
            </>
          }
          subtitle="What we collect when you book, why we need it, and what we do to keep it safe."
          image={canal}
        />
      }
      intro={
        <>
          <strong>{COMPANY.legalName}</strong> ({registeredAddress}) operates this website and the
          booking service on it. This policy explains what personal information we handle, why, and
          the choices you have. By booking with us you agree to what is described below.
        </>
      }
      sections={SECTIONS}
    />
  );
}
