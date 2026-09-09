import { z } from "zod";

export const bookingContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(6, "Enter a valid phone number"),
  requests: z.string().optional(),
  /** SSLCommerz merchant compliance: the customer must tick this themselves
   *  immediately before paying, and it must start blank. Living in the schema
   *  rather than in component state is what guarantees it — a submit can never
   *  reach the gateway with it unticked, however the button is reached. */
  acceptedTerms: z.literal(true, {
    errorMap: () => ({
      message:
        "Please read and accept the Terms & Conditions, Privacy Policy and Refund & Delivery Policy to continue.",
    }),
  }),
});

export type BookingContactValues = z.infer<typeof bookingContactSchema>;
