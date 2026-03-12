module.exports = {
  WN: {
    name: "Southwest Airlines",
    allowsRebooking: true,
    method: "self-service",
    url: "https://www.southwest.com/air/change/",
    phone: "1-800-435-9792",
    steps: [
      "Log in to southwest.com and go to 'My Trips'",
      "Select the flight that dropped in price",
      "Click 'Change Flight' and search for the same flight",
      "Select the lower fare — the difference is returned as travel credit or points"
    ],
    restrictions: [
      "Wanna Get Away Basic fares cannot be changed (must cancel entirely)",
      "Travel credits expire 12 months from original purchase date"
    ],
    refundType: "travel_credit_or_points",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  DL: {
    name: "Delta Air Lines",
    allowsRebooking: true,
    method: "self-service",
    url: "https://www.delta.com/mytrips/",
    phone: "1-800-221-1212",
    steps: [
      "Go to delta.com/mytrips and log in",
      "Find your booking and click 'Modify Flight'",
      "Select the same flight at the new lower fare",
      "The fare difference will be issued as a Delta eCredit"
    ],
    restrictions: [
      "Basic Economy (E fare) tickets cannot be changed or cancelled",
      "eCredits are valid for 1 year from date of issue",
      "Must rebook before departure"
    ],
    refundType: "ecredit",
    basicEconomyEligible: false,
    creditExpiry: "1 year",
  },
  UA: {
    name: "United Airlines",
    allowsRebooking: true,
    method: "self-service",
    url: "https://www.united.com/en/us/mytrips",
    phone: "1-800-864-8331",
    steps: [
      "Go to united.com and click 'My Trips'",
      "Find your reservation and click 'Change Flight'",
      "Search for the same route and date at the new fare",
      "If the system blocks same-flight changes, cancel and rebook as a new ticket",
      "The fare difference is issued as a United travel credit"
    ],
    restrictions: [
      "Basic Economy tickets cannot be changed at all",
      "Travel credits valid for 1 year from issue date",
      "Some routes may not show change options online — call if needed"
    ],
    refundType: "travel_credit",
    basicEconomyEligible: false,
    creditExpiry: "1 year",
  },
  AA: {
    name: "American Airlines",
    allowsRebooking: true,
    method: "self-service-or-call",
    url: "https://www.aa.com/reservation/view/find-your-reservation",
    phone: "1-800-433-7300",
    steps: [
      "Go to aa.com and navigate to 'Manage Trips'",
      "Find your reservation and select 'Change Trip'",
      "Search for the same flight at the lower fare",
      "The fare difference is issued as an American Airlines trip credit",
      "If online change fails, call 1-800-433-7300 and request a fare adjustment"
    ],
    restrictions: [
      "Basic Economy tickets are not eligible for changes",
      "Trip credits expire 1 year from issue date",
      "Phone agents may be more flexible than the website"
    ],
    refundType: "trip_credit",
    basicEconomyEligible: false,
    creditExpiry: "1 year",
  },
  B6: {
    name: "JetBlue",
    allowsRebooking: true,
    method: "self-service",
    url: "https://www.jetblue.com/manage-trips",
    phone: "1-800-538-2583",
    steps: [
      "Go to jetblue.com/manage-trips and find your booking",
      "Click 'Change' on your flight",
      "Select the same flight at the lower fare",
      "The fare difference goes to your JetBlue Travel Bank"
    ],
    restrictions: [
      "Blue Basic fares require cancellation fee ($100+) before rebooking",
      "Travel Bank credits valid for 12 months",
      "Blue, Blue Plus, and Mint fares can be changed for free"
    ],
    refundType: "travel_bank",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  AS: {
    name: "Alaska Airlines",
    allowsRebooking: true,
    method: "self-service",
    url: "https://www.alaskaair.com/booking/manage-trip",
    phone: "1-800-252-7522",
    steps: [
      "Go to alaskaair.com and click 'Manage Trip'",
      "Find your flight and select 'Cancel'",
      "Rebook the same flight at the lower fare",
      "The difference is issued as an Alaska Airlines travel credit"
    ],
    restrictions: [
      "Saver fares are non-changeable and non-refundable",
      "Travel credits valid for 1 year from purchase",
      "Cancel-and-rebook is the standard approach (no direct price adjustment)"
    ],
    refundType: "travel_credit",
    basicEconomyEligible: false,
    creditExpiry: "1 year",
  },
  NK: {
    name: "Spirit Airlines",
    allowsRebooking: true,
    method: "self-service",
    url: "https://www.spirit.com/manage-travel",
    phone: "1-855-728-3555",
    steps: [
      "Go to spirit.com and click 'Manage Travel'",
      "Find your reservation and select 'Modify'",
      "Change to the same flight at the lower fare",
      "Difference is added as a Spirit reservation credit"
    ],
    restrictions: [
      "Change fees may apply depending on fare type",
      "Reservation credits expire 90 days from issue",
      "Must modify at least 7 days before departure"
    ],
    refundType: "reservation_credit",
    basicEconomyEligible: true,
    creditExpiry: "90 days",
  },
  F9: {
    name: "Frontier Airlines",
    allowsRebooking: true,
    method: "self-service-or-call",
    url: "https://www.flyfrontier.com/manage-travel/",
    phone: "1-801-401-9000",
    steps: [
      "Go to flyfrontier.com and click 'Manage Travel'",
      "Find your booking and select 'Change Flight'",
      "Search for the same flight at the lower fare",
      "Difference is issued as a Frontier travel credit"
    ],
    restrictions: [
      "Changes must be made at least 7 days before departure",
      "Travel credits expire 90 days from issue",
      "Budget fares may have change fees"
    ],
    refundType: "travel_credit",
    basicEconomyEligible: true,
    creditExpiry: "90 days",
  },
  _default: {
    name: "Other Airline",
    allowsRebooking: null,
    method: "call",
    url: null,
    phone: null,
    steps: [
      "Contact the airline directly using the phone number on your booking confirmation",
      "Reference your booking confirmation number",
      "Ask if your fare is eligible for a price adjustment or travel credit",
      "If they decline, ask about cancelling and rebooking at the lower fare",
      "Note: Many airlines have free cancellation within 24 hours of booking (DOT rule)"
    ],
    restrictions: [
      "Policies vary by airline and fare class",
      "Basic Economy fares are typically not eligible for changes"
    ],
    refundType: "varies",
    basicEconomyEligible: null,
    creditExpiry: "varies",
  },
};
