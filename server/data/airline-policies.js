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
  // ── SkyTeam Alliance ──
  KE: {
    name: "Korean Air",
    allowsRebooking: false,
    method: "call",
    url: "https://www.koreanair.com/booking/manage",
    phone: "1-800-438-5000",
    steps: [
      "Check current fare on koreanair.com",
      "If you hold a refundable fare: cancel existing ticket, then rebook at lower fare",
      "If non-refundable: call 1-800-438-5000 to inquire about change options",
      "Pay change fee ($50-$150 depending on class) plus any fare difference",
      "Note: Korean Air does not offer formal price-drop protection"
    ],
    restrictions: [
      "No formal price-drop refund policy — cancel and rebook is the only option",
      "Basic/discounted economy fares are generally non-changeable",
      "Promotional fares may be locked",
      "Travel credits valid 1 year from original ticket issue"
    ],
    refundType: "refund_or_credit",
    basicEconomyEligible: false,
    creditExpiry: "1 year",
  },
  AF: {
    name: "Air France",
    allowsRebooking: false,
    method: "self-service-or-call",
    url: "https://wwws.airfrance.us/manage-booking",
    phone: "1-800-237-2747",
    steps: [
      "Log in to Manage Bookings on airfrance.us",
      "Check if your fare rules allow changes",
      "Light (basic) fares: change fee + fare difference, no downward refund",
      "Standard fares: change fee applies",
      "Flex fares: free changes",
      "If price dropped: only option is cancel + rebook if fare is refundable",
      "24-hour free cancellation applies for flights 7+ days out"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Light fares are non-refundable (only taxes refunded on cancellation)",
      "Standard fares charge a change fee",
      "Flex fares allow free changes",
      "Vouchers valid 12 months from issue"
    ],
    refundType: "refund_or_voucher",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  KL: {
    name: "KLM",
    allowsRebooking: false,
    method: "self-service-or-call",
    url: "https://www.klm.com/manage",
    phone: "1-800-618-0104",
    steps: [
      "Go to klm.com/manage, enter booking ref + last name",
      "Select 'Change flight'",
      "Light ticket: 300 EUR change fee + fare difference",
      "Standard (Europe): 70 EUR + fare difference",
      "Flex: free changes",
      "If lower fare available, remaining may become credit (fare-rule dependent)",
      "No guarantee of downward fare difference refund"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Light tickets: 300 EUR change fee",
      "Standard tickets: 70 EUR change fee (Europe)",
      "Flex tickets: free changes",
      "Credits typically valid 12 months"
    ],
    refundType: "refund_or_credit",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  AM: {
    name: "Aeromexico",
    allowsRebooking: false,
    method: "self-service-or-call",
    url: "https://www.aeromexico.com/en-us/manage-booking",
    phone: "1-800-237-6639",
    steps: [
      "Visit aeromexico.com/manage-booking",
      "Enter booking code + last name",
      "Select 'Change flight'",
      "Pay change fee ($300 for Classic/Comfort/AM Plus) + fare difference",
      "Basic fares are generally non-changeable",
      "No refund if new fare is lower",
      "Changes within 24 hours of booking are free"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Basic fares are non-refundable and non-changeable",
      "Classic/Comfort/AM Plus: $300 change fee per direction",
      "Flexible/Premium: free or low-cost changes",
      "Credits valid 12 months from original issue"
    ],
    refundType: "refund_or_credit",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  VS: {
    name: "Virgin Atlantic",
    allowsRebooking: false,
    method: "self-service",
    url: "https://www.virginatlantic.com/en-US/manage-booking",
    phone: "1-800-862-8621",
    steps: [
      "Go to virginatlantic.com/en-US/manage-booking",
      "Enter booking ref + last name",
      "Select change option — no admin/change fees charged",
      "Pay fare difference if new flight costs more",
      "No refund if new flight is cheaper",
      "24-hour free cancellation applies for US-originating flights"
    ],
    restrictions: [
      "No change fees on any fare type",
      "Fare difference applies upward only — no refund downward",
      "Economy Light fares have most restrictions on cancellation refunds",
      "Vouchers typically valid 12 months"
    ],
    refundType: "refund_or_voucher",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  AZ: {
    name: "ITA Airways",
    allowsRebooking: false,
    method: "self-service-or-call",
    url: "https://www.ita-airways.com/en_us/manage-my-booking.html",
    phone: "1-877-793-1717",
    steps: [
      "Go to ita-airways.com manage booking, enter PNR + last name",
      "Select flight change",
      "Economy Light (long-haul): $199 change fee per route",
      "Economy Classic/Flex and Premium: free destination and date changes",
      "No refund if new fare is lower",
      "24-hour cancellation: all fare types, full refund"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Economy Light: $199/route change fee",
      "Economy Classic/Flex: free changes (long-haul)",
      "Non-refundable fares: taxes only on cancellation",
      "Vouchers typically valid 12 months"
    ],
    refundType: "refund_or_voucher",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  MU: {
    name: "China Eastern",
    allowsRebooking: false,
    method: "self-service-or-call",
    url: "https://us.ceair.com/en/manage-booking.html",
    phone: "1-800-284-2622",
    steps: [
      "Visit us.ceair.com manage booking",
      "Enter booking ref",
      "Select change — change fees vary by fare class and route",
      "Business/First class: lower or no change fees",
      "No refund if new fare is lower",
      "24-hour free cancellation for US-originating flights"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Economy promotional fares: highest fees or non-changeable",
      "Business/First: most flexibility",
      "Credits valid 12 months from issue"
    ],
    refundType: "refund_or_credit",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  VN: {
    name: "Vietnam Airlines",
    allowsRebooking: false,
    method: "self-service-or-call",
    url: "https://www.vietnamairlines.com/us/en",
    phone: "1-866-677-8909",
    steps: [
      "Log in to vietnamairlines.com Manage Booking",
      "Online exchange only to equal or higher fare — pay fare difference",
      "Must change 3+ hours before departure to avoid no-show fees",
      "No price-drop refund available",
      "24-hour free cancellation for US-originating flights"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Online exchange only to equal or higher fare",
      "Must change 3+ hours before departure",
      "Fare conditions vary by class"
    ],
    refundType: "varies",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  CI: {
    name: "China Airlines",
    allowsRebooking: false,
    method: "call",
    url: "https://www.china-airlines.com/us/en",
    phone: "1-800-227-5118",
    steps: [
      "Call China Airlines at 1-800-227-5118",
      "Provide your booking reference and request a change",
      "Pay change fee + fare difference if applicable",
      "No refund if new fare is lower",
      "24-hour free cancellation for US-originating flights"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Change fees vary by fare class",
      "Promotional fares may be non-changeable",
      "Credits valid 12 months"
    ],
    refundType: "varies",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  GA: {
    name: "Garuda Indonesia",
    allowsRebooking: false,
    method: "call",
    url: "https://www.garuda-indonesia.com",
    phone: "+62-21-2351-9999",
    steps: [
      "Contact Garuda Indonesia call center or sales office",
      "Provide your booking reference",
      "Change fees vary by fare class",
      "No refund if new fare is lower",
      "24-hour cancellation applies for US-originating flights"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Fees vary by fare class",
      "Must contact call center or travel agent for changes"
    ],
    refundType: "varies",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  KQ: {
    name: "Kenya Airways",
    allowsRebooking: false,
    method: "self-service-or-call",
    url: "https://www.kenya-airways.com/en/book-manage/self-rebooking-service/",
    phone: "+254-711-024747",
    steps: [
      "Go to kenya-airways.com self-rebooking service",
      "Enter booking reference",
      "Most restrictive fare rule applies to entire itinerary",
      "Pay change fee + fare difference",
      "Multi-city bookings require calling in"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Most restrictive fare rule applies",
      "Change fees are non-refundable",
      "Multi-city and schedule-change bookings require phone"
    ],
    refundType: "varies",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  SV: {
    name: "Saudia",
    allowsRebooking: false,
    method: "self-service-or-call",
    url: "https://www.saudia.com",
    phone: "+966-920003777",
    steps: [
      "Go to saudia.com Manage Booking",
      "Enter booking reference",
      "Select change option",
      "Pay change fee + fare difference if applicable",
      "No refund if new fare is lower"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Change fees vary by fare class",
      "Promotional fares may be non-changeable"
    ],
    refundType: "varies",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  RO: {
    name: "TAROM",
    allowsRebooking: false,
    method: "self-service-or-call",
    url: "https://www.tarom.ro/en/my-booking/",
    phone: "1-844-415-3955",
    steps: [
      "Go to tarom.ro/en/my-booking",
      "Use 'Modify flights' button",
      "Subject to fare conditions",
      "Pay change fee + fare difference if applicable",
      "No refund if new fare is lower"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Subject to fare conditions",
      "Change fees vary by fare class"
    ],
    refundType: "varies",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  ME: {
    name: "Middle East Airlines",
    allowsRebooking: false,
    method: "call",
    url: "https://www.mea.com.lb",
    phone: "+961-1-629999",
    steps: [
      "Contact MEA at +961-1-629999 or email callcent@mea.com.lb",
      "Provide booking reference",
      "Request fare change — fees vary by class",
      "No refund if new fare is lower"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Fare rules vary by class",
      "Must contact call center for changes"
    ],
    refundType: "varies",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  UX: {
    name: "Air Europa",
    allowsRebooking: false,
    method: "self-service-or-call",
    url: "https://www.aireuropa.com/en/flights/manage-booking",
    phone: "+34-911-401-501",
    steps: [
      "Go to aireuropa.com manage booking",
      "Enter booking reference + last name",
      "Select change option",
      "Pay change fee + fare difference if applicable",
      "No refund if new fare is lower"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Lite fares are non-changeable",
      "Change fees vary by fare class"
    ],
    refundType: "varies",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
  },
  MF: {
    name: "Xiamen Airlines",
    allowsRebooking: false,
    method: "self-service-or-call",
    url: "https://www.xiamenair.com",
    phone: "1-855-789-5557",
    steps: [
      "Go to xiamenair.com 'My Trip' section",
      "Enter booking reference",
      "Online changes, cancellations, and extra baggage available",
      "Pay change fee + fare difference if applicable",
      "No refund if new fare is lower"
    ],
    restrictions: [
      "No formal price-drop protection",
      "Fare conditions vary by class",
      "Code-share flights: operating carrier's rules apply"
    ],
    refundType: "varies",
    basicEconomyEligible: false,
    creditExpiry: "12 months",
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
