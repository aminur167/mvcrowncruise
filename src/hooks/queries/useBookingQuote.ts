import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { quoteBooking } from "@/lib/api/bookings";
import type { BookingQuoteRequest } from "@/lib/api/types";

/** How long the selection has to hold still before it is worth asking the
 *  server what it costs. Long enough that holding down "+" is one request
 *  rather than five, short enough that nobody notices waiting for it. */
const SETTLE_MS = 250;

/** Live price quote — refetches whenever package/room/pax change. Also
 * doubles as client-side validation (pax limits, cutoff) before submission,
 * since the quote endpoint validates identically to create.
 *
 * Two things here exist to stop the fare summary flickering, which is what it
 * did on every single click of a guest counter:
 *
 * 1. The request is a new object with a new cache key each time the selection
 *    changes, so React Query has no data for it and `data` comes back
 *    undefined mid-flight. The summary emptied itself between the click and
 *    the answer — a customer reading a figure watched it vanish and return,
 *    which looks like the page breaking rather than working. `keepPreviousData`
 *    leaves the last figures up until the new ones land.
 *
 * 2. The counters fire one request per click, and this backend can be slow to
 *    wake. The request is held until the selection settles, so a party of four
 *    entered in four taps costs one quote instead of four.
 */
export function useBookingQuote(request: BookingQuoteRequest | undefined) {
  // Compared by VALUE, not identity: `request` is rebuilt every render, so an
  // identity check would restart the timer forever and never settle.
  const serialised = request ? JSON.stringify(request) : "";
  const [settled, setSettled] = useState(serialised);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(serialised), SETTLE_MS);
    return () => clearTimeout(timer);
  }, [serialised]);

  const query = useQuery({
    queryKey: ["booking-quote", settled],
    queryFn: () => quoteBooking(JSON.parse(settled) as BookingQuoteRequest),
    enabled: settled !== "",
    retry: false,
    placeholderData: keepPreviousData,
    // Nothing about a fare changes because a window regained focus. Refetching
    // there put a spinner over a price that was already correct.
    refetchOnWindowFocus: false,
  });

  // Keeping the last figures is right while a selection is CHANGING, and wrong
  // once there is no selection at all — removing the final cabin would
  // otherwise leave a total sitting under an empty booking.
  const nothingSelected = serialised === "";

  return {
    ...query,
    data: nothingSelected ? undefined : query.data,
    /** True while the figures on screen belong to an older selection than the
     *  one the customer has made — the cue for dimming them, not for tearing
     *  them down. */
    isStale: !nothingSelected && (query.isPlaceholderData || settled !== serialised),
  };
}
