module.exports = {
  _regulations: {
    domestic: {
      maxLiability: 4700,
      currency: "USD",
      authority: "US DOT (14 CFR Part 254)",
      checkedBagFeeRefund: true,
    },
    international: {
      maxLiabilitySdr: 1519,
      maxLiabilityUsdApprox: 2175,
      currency: "SDR",
      authority: "Montreal Convention",
      damagedDeadlineDays: 7,
      delayedDeadlineDays: 21,
    },
    dot: {
      complaintUrl: "https://secure.dot.gov/air-travel-complaint",
      infoUrl: "https://www.transportation.gov/lost-delayed-or-damaged-baggage",
      airlineAcknowledgeDays: 30,
      airlineResponseDays: 60,
      steps: [
        "Exhaust the airline's complaint process first",
        "Go to secure.dot.gov/air-travel-complaint",
        "Fill out the complaint form with your flight details and claim history",
        "DOT will forward your complaint to the airline and require a response",
        "Consider small claims court if the amount justifies it"
      ],
    },
  },

  WN: {
    name: "Southwest Airlines",
    deadlines: {
      damaged: { domestic: "4 hours from arrival", international: "7 days" },
      delayed: { domestic: "4 hours from arrival", international: "21 days from delivery" },
      lost: { domestic: "Report immediately", international: "21 days" },
    },
    portalUrl: "https://www.southwest.com/bagclaim",
    phoneBaggage: "1-866-673-2156",
    phoneGeneral: "1-800-435-9792",
    processingDays: "14-28 days",
    steps: {
      lost: [
        "Report immediately at the Baggage Service Office before leaving the airport",
        "Get a File ID number from the agent",
        "Submit your claim online at southwest.com/bagclaim using your File ID",
        "Upload photos of baggage tag, boarding pass, and an itemized contents list with values",
        "Track claim status online using your File ID",
        "If unresolved after 21 days, bag is declared lost — airline must compensate up to $4,700"
      ],
      damaged: [
        "Report at the Baggage Service Office within 4 hours (domestic) or 7 days (international)",
        "Show the damage to an agent and get a File ID number",
        "Submit claim online at southwest.com/bagclaim with photos of damage",
        "Include close-up photos, full bag photo, baggage tag, and boarding pass",
        "Southwest may offer repair, replacement, or depreciated value compensation"
      ],
      delayed: [
        "Report at the Baggage Service Office before leaving the airport",
        "Get a File ID and ask about interim expense reimbursement",
        "Track delivery status online using your File ID",
        "Keep all receipts for essential purchases (toiletries, clothing) — these are reimbursable",
        "If bag arrives damaged, file a separate damage claim"
      ],
    },
    documentation: [
      "File ID from Baggage Service Office",
      "Boarding pass or e-ticket confirmation",
      "Baggage claim tag",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values and purchase dates",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "Report before leaving the airport for the best outcome",
      "Southwest is known for relatively fast baggage claim processing",
      "Keep your baggage tag — it's your proof of checked luggage"
    ],
  },

  DL: {
    name: "Delta Air Lines",
    deadlines: {
      damaged: { domestic: "6 hours from arrival", international: "7 days" },
      delayed: { domestic: "24 hours", international: "21 days from delivery" },
      lost: { domestic: "Report immediately", international: "21 days" },
    },
    portalUrl: "https://www.delta.com/bag-claim",
    phoneBaggage: "1-800-325-8224",
    phoneGeneral: "1-800-221-1212",
    processingDays: "14-28 days",
    steps: {
      lost: [
        "Report at the Delta Baggage Service Office at the airport immediately",
        "Receive a reference code from the agent",
        "Submit claim online at delta.com/bag-claim using your reference code",
        "Upload itemized contents list with values, boarding pass, and baggage tag",
        "Track status through Delta website or Fly Delta app",
        "After 21 days, bag is declared lost and compensation is processed"
      ],
      damaged: [
        "Report at the Baggage Service Office within 6 hours (domestic) or 7 days (international)",
        "Show damage to an agent and receive a reference code",
        "Submit claim online at delta.com/bag-claim with photos of damage",
        "Delta may offer repair, replacement, or depreciated value compensation"
      ],
      delayed: [
        "Report at the Baggage Service Office before leaving the airport",
        "Get a reference code and ask about interim expense allowance",
        "Track delivery through delta.com or the Fly Delta app",
        "Keep receipts for essential purchases — Delta reimburses reasonable expenses"
      ],
    },
    documentation: [
      "Reference code from Baggage Service Office",
      "Boarding pass or e-ticket confirmation",
      "Baggage claim tag",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "Delta's domestic damage deadline is 6 hours — act fast",
      "The Fly Delta app has real-time bag tracking",
      "Delta sometimes offers interim expense allowance at the airport"
    ],
  },

  UA: {
    name: "United Airlines",
    deadlines: {
      damaged: { domestic: "24 hours", international: "7 days" },
      delayed: { domestic: "24 hours", international: "21 days from delivery" },
      lost: { domestic: "Report immediately, claim within 45 days", international: "21 days" },
    },
    portalUrl: "https://www.united.com/en/us/baggage/bag-help",
    phoneBaggage: "1-800-335-2247",
    phoneGeneral: "1-800-864-8331",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "File a Property Irregularity Report (PIR) at the Baggage Service Office immediately",
        "Get your file reference number — keep this safe",
        "Submit formal claim online at united.com/en/us/baggage/bag-help",
        "Upload itemized contents list, receipts, boarding pass, and baggage tag",
        "Bags not found within 21 days are declared lost",
        "Submit reimbursement claim within 45 days (domestic)"
      ],
      damaged: [
        "Report at the Baggage Service Office within 24 hours (domestic) or 7 days (international)",
        "File a Property Irregularity Report (PIR) and get a reference number",
        "Submit claim online with photos of damage",
        "United may offer repair or depreciated value compensation"
      ],
      delayed: [
        "File a PIR at the Baggage Service Office before leaving the airport",
        "Get your reference number and ask about interim expense policy",
        "Track delivery status online using your reference number",
        "Keep receipts — submit for reimbursement within 45 days (domestic) or 21 days (international)"
      ],
    },
    documentation: [
      "Property Irregularity Report (PIR) reference number",
      "Boarding pass or e-ticket confirmation",
      "Baggage claim tag",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "United calls it a Property Irregularity Report (PIR) — same thing as a claim",
      "Domestic reimbursement deadline is 45 days — don't miss it",
      "The United app has bag tracking for tagged luggage"
    ],
  },

  AA: {
    name: "American Airlines",
    deadlines: {
      damaged: { domestic: "24 hours", international: "7 days" },
      delayed: { domestic: "24 hours", international: "21 days" },
      lost: { domestic: "Claim within 30 days of flight", international: "21 days" },
    },
    portalUrl: "https://www.aa.com/i18n/travel-info/baggage/delayed-or-damaged-baggage.jsp",
    phoneBaggage: "1-800-535-5225",
    phoneGeneral: "1-800-433-7300",
    mailAddress: "American Airlines Central Baggage, P.O. Box 619619, DFW Airport, TX 75261-9616",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at the Baggage Service Office before leaving the airport",
        "Get a file reference number from the agent",
        "File claim online through aa.com baggage section",
        "Complete the Passenger Property Questionnaire",
        "Upload itemized contents list, receipts, boarding pass, and baggage tag",
        "Claim must be submitted within 30 days of flight date"
      ],
      damaged: [
        "Report at the Baggage Service Office before leaving the airport (within 24 hours)",
        "Get a file reference number and show the damage",
        "File claim online with photos of damage",
        "American may offer repair, replacement, or depreciated value"
      ],
      delayed: [
        "Report at the Baggage Service Office before leaving the airport",
        "Get a reference number and ask about interim expense policy",
        "Track status through aa.com or the American Airlines app",
        "Keep receipts — submit within 30 days of flight"
      ],
    },
    documentation: [
      "File reference number from Baggage Service Office",
      "Boarding pass or e-ticket confirmation",
      "Baggage claim tag",
      "Passenger Property Questionnaire (AA form)",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "American requires a Passenger Property Questionnaire — download it from their site",
      "You can also mail documentation to their Central Baggage office in DFW",
      "30-day deadline is strict — file early"
    ],
  },

  B6: {
    name: "JetBlue",
    deadlines: {
      damaged: { domestic: "Before leaving airport", international: "7 days" },
      delayed: { domestic: "4 hours from arrival", international: "21 days from delivery" },
      lost: { domestic: "Report immediately", international: "21 days" },
    },
    portalUrl: "https://www.jetblue.com/help/bag-claims",
    phoneBaggage: "1-866-538-5438",
    phoneGeneral: "1-800-538-2583",
    processingDays: "14-28 days",
    steps: {
      lost: [
        "Report at the JetBlue Baggage Service Office in the baggage claim area",
        "Get a File ID number from the agent",
        "Submit claim online at jetblue.com/help/bag-claims",
        "Upload itemized contents list, receipts, boarding pass, and baggage tag",
        "Track status through JetBlue baggage portal using your File ID",
        "After 21 days, bag is declared lost — compensation is processed"
      ],
      damaged: [
        "Report at the Baggage Service Office ASAP — before leaving the airport",
        "Get a File ID and show the damage to the agent",
        "Submit claim online with photos of damage",
        "JetBlue may offer repair, replacement, or depreciated value"
      ],
      delayed: [
        "Report at the Baggage Service Office within 4 hours of arrival",
        "Get a File ID and ask about interim expense reimbursement",
        "Track delivery via JetBlue baggage portal",
        "Keep receipts for essential purchases"
      ],
    },
    documentation: [
      "File ID from Baggage Service Office",
      "Boarding pass or e-ticket confirmation",
      "Baggage claim tag",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "Report damage before leaving the airport — no grace period for domestic",
      "JetBlue uses NetTracer for bag tracking",
      "Their 24/7 alternate number is 1-866-284-3014"
    ],
  },

  AS: {
    name: "Alaska Airlines",
    deadlines: {
      damaged: { domestic: "24 hours", international: "7 days" },
      delayed: { domestic: "24 hours", international: "21 days from delivery" },
      lost: { domestic: "Report immediately", international: "21 days" },
    },
    portalUrl: "https://www.alaskaair.com/content/travel-info/baggage/baggage-claim/delayed-damaged-missing",
    phoneBaggage: "1-877-815-8253",
    phoneBaggageHours: "6am-10pm PT",
    phoneGeneral: "1-800-252-7522",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at the airport Baggage Service Office immediately (within 24 hours)",
        "Get a file reference number from the agent",
        "Submit formal claim online through Alaska's baggage portal",
        "Upload photos, receipts, and itemized contents list",
        "If bag still missing after 5 days, call Central Baggage at 1-877-815-8253",
        "After 21 days, bag is declared lost — compensation is processed"
      ],
      damaged: [
        "Report at the Baggage Service Office within 24 hours (domestic) or 7 days (international)",
        "Show damage and get a file reference number",
        "Submit claim online with photos of damage",
        "Alaska may offer repair or depreciated value compensation"
      ],
      delayed: [
        "Report at the Baggage Service Office before leaving the airport",
        "Get a file reference number and ask about interim expense policy",
        "Track delivery online using your reference number",
        "Keep receipts — call Central Baggage at 1-877-815-8253 if still missing after 5 days"
      ],
    },
    documentation: [
      "File reference number from Baggage Service Office",
      "Boarding pass or e-ticket confirmation",
      "Baggage claim tag",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "Central Baggage is available 6am-10pm Pacific Time",
      "Call Central Baggage after 5 days if bag still missing",
      "Alaska's general line (1-800-252-7522) is available 24/7"
    ],
  },

  _default: {
    name: "Other Airline",
    deadlines: {
      damaged: { domestic: "24 hours (typical)", international: "7 days (Montreal Convention)" },
      delayed: { domestic: "Varies by airline", international: "21 days (Montreal Convention)" },
      lost: { domestic: "Report immediately", international: "21 days" },
    },
    portalUrl: null,
    phoneBaggage: null,
    phoneGeneral: null,
    processingDays: "14-30 days (typical)",
    steps: {
      lost: [
        "Report at the airport Baggage Service Office immediately",
        "Get a file reference number or incident report number",
        "Contact the airline to file a formal claim",
        "Provide itemized contents list, boarding pass, and baggage tag",
        "Follow up regularly — bags not found within 21 days are declared lost"
      ],
      damaged: [
        "Report at the Baggage Service Office immediately",
        "Get a reference number and show damage to the agent",
        "File a formal claim through the airline's website or by phone",
        "Include photos of the damage and travel documents"
      ],
      delayed: [
        "Report at the Baggage Service Office before leaving the airport",
        "Get a reference number and ask about interim expense policy",
        "Keep receipts for essential purchases",
        "Track status through the airline's website or by calling"
      ],
    },
    documentation: [
      "File reference number from airport",
      "Boarding pass or e-ticket confirmation",
      "Baggage claim tag",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "Always report before leaving the airport",
      "Most airlines exclude fragile items, electronics, cash, and jewelry",
      "Compensation is based on depreciated value, not replacement cost"
    ],
  },
};
