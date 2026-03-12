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

  // ── SkyTeam Alliance ──
  KE: {
    name: "Korean Air",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from receipt" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "21 days" },
    },
    portalUrl: "https://www.koreanair.com/airport/baggage/damaged-or-lost",
    phoneBaggage: "1-800-438-5000",
    phoneGeneral: "1-800-438-5000",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report immediately at the baggage service desk before leaving arrivals",
        "Complete a Property Irregularity Report (PIR) with your baggage tag",
        "Receive your file reference number",
        "Track via WorldTracer system",
        "If not found within 21 days, file formal compensation claim online",
        "Include itemized contents list with values and receipts"
      ],
      damaged: [
        "Report at baggage desk immediately before leaving the airport",
        "Complete a damage report with the agent",
        "Submit written claim within 7 days of receiving baggage",
        "Include photos of damage, baggage tag, and boarding pass"
      ],
      delayed: [
        "File PIR at airport baggage desk before leaving",
        "Purchase essential items only — keep all receipts",
        "Submit reimbursement claim within 21 days of receiving bag",
        "Track delivery via WorldTracer"
      ],
    },
    documentation: [
      "PIR reference number",
      "Boarding pass and baggage claim tags",
      "Passport/ID",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values and purchase dates",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "Korean Air stores unclaimed items only 30 days before disposal",
      "Passports/valuables found are turned over to airport police",
      "Always keep baggage tags attached to your boarding pass until you collect bags",
      "Compensation limit: ~$1,400-$2,080 USD under Montreal Convention"
    ],
  },
  AF: {
    name: "Air France",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from receipt" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "21 days" },
    },
    portalUrl: "https://wwws.airfrance.us/claim",
    phoneBaggage: "1-800-873-2247",
    phoneGeneral: "1-800-237-2747",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at the Air France baggage office before leaving the airport",
        "Complete a Property Irregularity Report (PIR)",
        "Receive your file reference number",
        "After 21 days, if not found, file formal claim online at airfrance.us/claim",
        "List lost items with estimated values and receipts"
      ],
      damaged: [
        "Report at baggage desk immediately",
        "Complete a damage report",
        "File written claim within 7 days",
        "Submit photos of damage and repair estimates"
      ],
      delayed: [
        "File PIR at airport baggage desk",
        "Buy essentials only (toiletries, clothing, medication)",
        "Keep every receipt — non-essentials will not be refunded",
        "Submit reimbursement online within 21 days of bag return"
      ],
    },
    documentation: [
      "PIR reference number",
      "Boarding pass and baggage claim tags",
      "Passport/ID",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "Stick to basics for delayed bag purchases — souvenirs won't be refunded",
      "Keep receipts for small laundry costs too — these are reimbursable",
      "Air France and KLM share parent company — policies are very similar",
      "Compensation limit: ~$2,080 USD (1,920 EUR) under Montreal Convention"
    ],
  },
  KL: {
    name: "KLM",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from receipt" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "21 days" },
    },
    portalUrl: "https://www.klm.com/information/refund-compensation/baggage-compensation",
    phoneBaggage: "1-800-618-0104",
    phoneGeneral: "1-800-618-0104",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at KLM baggage desk before leaving the airport",
        "Complete PIR and receive file reference number",
        "Track via baggage tracking system (name + reference)",
        "Most bags are found within 3 days",
        "After 21 days, file formal lost baggage claim online"
      ],
      damaged: [
        "Report at baggage desk immediately",
        "Get a damage report generated",
        "If already left airport, file report online within 7 days"
      ],
      delayed: [
        "File PIR at airport baggage desk",
        "After 24 hours, check status online with last name + file reference",
        "Purchase essentials and keep receipts",
        "Submit claim within 21 days of bag return"
      ],
    },
    documentation: [
      "PIR reference number",
      "Boarding pass and baggage claim tags",
      "Passport/ID",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "KLM and Air France share the same parent company — you can file claims through either portal for codeshare flights",
      "KLM's online damage reporting works if you've already left the airport",
      "Compensation limit: ~$2,080 USD (1,920 EUR) under Montreal Convention"
    ],
  },
  AM: {
    name: "Aeromexico",
    deadlines: {
      damaged: { domestic: "7 days from receipt", international: "7 days from receipt" },
      delayed: { domestic: "21 days from delivery", international: "21 days from delivery" },
      lost: { domestic: "Report immediately", international: "21 days" },
    },
    portalUrl: "https://www.aeromexico.com/en-us/travel-information/baggage",
    phoneBaggage: "1-855-546-5596",
    phoneGeneral: "1-800-237-6639",
    processingDays: "10-20 business days",
    steps: {
      lost: [
        "Report immediately at the Aeromexico counter before leaving arrivals",
        "Complete form with flight number, luggage description, contact info, and baggage tag sticker",
        "Receive PIR reference number",
        "Track at vuela.aeromexico.com/track-your-luggage/",
        "File compensation claim online or by phone if not found within 21 days"
      ],
      damaged: [
        "Report at baggage desk before leaving the airport",
        "File within 7 days of receipt",
        "Include photos of damage"
      ],
      delayed: [
        "File PIR at airport counter",
        "Buy essentials and keep receipts",
        "Track delivery at vuela.aeromexico.com/track-your-luggage/",
        "Submit reimbursement claim"
      ],
    },
    documentation: [
      "Passport and boarding pass",
      "Baggage tag number",
      "PIR reference number",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "Aeromexico has a luggage tracker at vuela.aeromexico.com/track-your-luggage/",
      "Processing time is typically 10-20 business days",
      "Compensation limit: ~$2,080 USD under Montreal Convention"
    ],
  },
  VS: {
    name: "Virgin Atlantic",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days (report at airport if possible)" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "21 days" },
    },
    portalUrl: "https://help.virginatlantic.com/us/en/baggage.html",
    phoneBaggage: "1-800-862-8621",
    phoneGeneral: "1-800-862-8621",
    processingDays: "14-28 days",
    steps: {
      lost: [
        "Report in the baggage reclaim hall before leaving",
        "Complete Missing Bag Report (AHL) and get your 10-character reference number",
        "After 21 days, fill out Irretrievably Lost Baggage log listing all items with proof of purchase",
        "Submit by email to baggage.claims@fly.virgin.com or by post"
      ],
      damaged: [
        "Report to ground staff in the baggage hall immediately",
        "At some airports, Virgin Atlantic can settle on the spot (replacement bag or repair)",
        "If not settled, file written claim within 7 days",
        "Use the Damaged Baggage postal claim form"
      ],
      delayed: [
        "Report before leaving airport, complete AHL",
        "Essential items guideline: ~$75 USD per day",
        "Keep receipts for cosmetics, toiletries, basic clothing",
        "Submit reimbursement claim with receipts"
      ],
    },
    documentation: [
      "Missing Bag Report (AHL) reference number",
      "Boarding pass and baggage claim tags",
      "Documented proof of purchase (date + price) for lost items",
      "Photos of damage (for damaged claims)",
      "Receipts for interim purchases",
      "Passport/ID"
    ],
    tips: [
      "Virgin Atlantic strongly recommends travel insurance",
      "Minor damage (scuffs, dents) that doesn't affect bag structure won't be accepted",
      "Normal wear and tear is excluded from claims",
      "Email for baggage claims: baggage.claims@fly.virgin.com"
    ],
  },
  AZ: {
    name: "ITA Airways",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from filing D.P.R." },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "ITA searches 45 days, then declared lost" },
    },
    portalUrl: "https://www.ita-airways.com/en_us/support/baggage-assistance.html",
    phoneBaggage: "1-877-793-1717",
    phoneGeneral: "1-877-793-1717",
    processingDays: "14-45 days",
    steps: {
      lost: [
        "Report at the Baggage Assistance Counter at the arrival airport",
        "Complete a PIR and receive your file reference number",
        "ITA searches for up to 45 days",
        "If not found, file formal lost claim with itemized contents",
        "Notify within 21 days of return if items are missing from a returned bag"
      ],
      damaged: [
        "Report at Baggage Assistance office immediately",
        "Complete Damaged Property Report (D.P.R.)",
        "File written claim within 7 days",
        "Include photos of damage"
      ],
      delayed: [
        "File PIR at airport baggage desk",
        "ITA covers essential items while waiting — keep receipts",
        "Submit reimbursement claim",
        "Track delivery status with your reference number"
      ],
    },
    documentation: [
      "PIR or D.P.R. reference number",
      "Boarding pass and baggage claim tags",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases",
      "Passport/ID"
    ],
    tips: [
      "ITA has been reported for slow claim processing — document everything meticulously",
      "For US-originating flights, reference DOT consumer protection rules if claim stalls",
      "ITA searches for 45 days (longer than most airlines) before declaring lost",
      "Compensation limit: ~$2,080 USD under Montreal Convention"
    ],
  },
  MU: {
    name: "China Eastern",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from arrival" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "21+ days" },
    },
    portalUrl: "https://us.ceair.com",
    phoneBaggage: "1-800-284-2622",
    phoneGeneral: "1-800-284-2622",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at baggage services counter immediately",
        "Complete PIR with passport, boarding pass, and tag number",
        "Receive reference number",
        "Track status and follow up regularly",
        "File compensation claim if not recovered after 21 days"
      ],
      damaged: [
        "Report immediately at airport baggage services",
        "File Baggage Irregularity Report within 7 days",
        "Include photos of damage"
      ],
      delayed: [
        "File report at airport baggage counter",
        "Keep receipts for essential purchases",
        "International flights follow Montreal Convention reimbursement rules",
        "Submit claim with receipts"
      ],
    },
    documentation: [
      "Passport and boarding pass",
      "Baggage claim tag",
      "PIR reference number",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "China Eastern customer service can be slow — document everything",
      "For US-originating flights, reference DOT consumer protection if claim stalls",
      "Litigation deadline: 2 years from arrival at destination",
      "Compensation limit: ~$2,080 USD under Montreal Convention for international"
    ],
  },
  VN: {
    name: "Vietnam Airlines",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from receipt" },
      delayed: { domestic: "N/A", international: "7 days from when bag should have been received" },
      lost: { domestic: "N/A", international: "Report immediately" },
    },
    portalUrl: "https://www.vietnamairlines.com/us/en/help-desk/common-topics/Baggage/baggage-claim",
    phoneBaggage: "1-866-677-8909",
    phoneGeneral: "1-866-677-8909",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at baggage service desk before leaving the airport",
        "Complete PIR with all flight and baggage details",
        "Receive file reference number",
        "Follow up via phone or email (onlinesupport.us@vietnamairlines.com)",
        "File formal claim if not found within 21 days"
      ],
      damaged: [
        "Report at baggage desk immediately",
        "File written claim within 7 days",
        "Include photos of damage"
      ],
      delayed: [
        "File PIR at airport",
        "Submit supplemental info within 7 days of expected delivery",
        "Keep receipts for essential purchases",
        "Unclaimed bags disposed after 90 days"
      ],
    },
    documentation: [
      "PIR reference number",
      "Boarding pass and baggage claim tags",
      "Passport/ID",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for interim purchases"
    ],
    tips: [
      "Vietnam Airlines disposes unclaimed bags after 90 days — act fast",
      "Compensation for international (non-EU): up to $20 USD/kg checked, $400 max for carry-on",
      "Email support: onlinesupport.us@vietnamairlines.com"
    ],
  },
  CI: {
    name: "China Airlines",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from arrival" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "21 days" },
    },
    portalUrl: "https://airportservice.china-airlines.com/Baggage/lost-damages-apply.aspx?country=us&locale=en",
    phoneBaggage: "1-800-227-5118",
    phoneGeneral: "1-800-227-5118",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at baggage services desk before leaving the airport",
        "Complete PIR and receive reference number",
        "Track at calec.china-airlines.com/ebaggage",
        "File formal claim if not recovered after 21 days"
      ],
      damaged: [
        "Report at baggage desk immediately",
        "File claim within 7 days",
        "Include photos of damage"
      ],
      delayed: [
        "File PIR at airport",
        "Track delivery at calec.china-airlines.com/ebaggage",
        "Keep receipts for essential purchases",
        "Submit reimbursement claim"
      ],
    },
    documentation: [
      "PIR reference number",
      "Boarding pass and baggage claim tags",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "China Airlines has online baggage tracking at calec.china-airlines.com/ebaggage",
      "US office: 200 N. Continental Blvd, El Segundo, CA 90245",
      "Compensation limit: ~$2,080 USD under Montreal Convention"
    ],
  },
  GA: {
    name: "Garuda Indonesia",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from receipt" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "21 days" },
    },
    portalUrl: "https://www.garuda-indonesia.com",
    phoneBaggage: "+62-21-2351-9999",
    phoneGeneral: "+62-21-2351-9999",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at Lost & Found office before leaving arrivals",
        "Complete PIR with flight and baggage details",
        "Receive reference number",
        "Follow up regularly",
        "File formal compensation claim if not found"
      ],
      damaged: [
        "Report at Lost & Found office immediately",
        "Unrepairable bags may be replaced",
        "Cash compensation available in some cases",
        "File written claim within 7 days"
      ],
      delayed: [
        "File PIR at airport",
        "Keep receipts for essential purchases",
        "Submit reimbursement claim"
      ],
    },
    documentation: [
      "PIR reference number",
      "Boarding pass and baggage claim tags",
      "Passport/ID",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for interim purchases"
    ],
    tips: [
      "Garuda uses the Lost & Found office (not always labeled 'Baggage Services')",
      "Compensation limit: ~$2,080 USD under Montreal Convention",
      "Phone is 24/7 international line"
    ],
  },
  KQ: {
    name: "Kenya Airways",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from receipt" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "21 days" },
    },
    portalUrl: "https://www.kenya-airways.com/en/plan/baggage-information/delayed-baggage/",
    phoneBaggage: "+254-711-024747",
    phoneGeneral: "+254-711-024747",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at baggage services before leaving the airport",
        "Complete PIR and receive reference number",
        "Follow up via phone or email (customer.relations@kenya-airways.com)",
        "File formal claim if not recovered"
      ],
      damaged: [
        "Report at baggage desk immediately",
        "File written claim within 7 days",
        "Include photos of damage"
      ],
      delayed: [
        "File PIR at airport",
        "Keep receipts for essential purchases (toiletries, change of clothes)",
        "Submit reimbursement claim with receipts"
      ],
    },
    documentation: [
      "PIR reference number",
      "Boarding pass and baggage claim tags",
      "Passport/ID",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for interim purchases"
    ],
    tips: [
      "Email: customer.relations@kenya-airways.com for follow-up",
      "Kenya Airways covers reasonable expenses with receipts for delayed bags",
      "Compensation limit: ~$2,080 USD under Montreal Convention"
    ],
  },
  SV: {
    name: "Saudia",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from issuing Damage Report" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "Claim within 11 days if not located in 10 days" },
    },
    portalUrl: "https://www.saudia.com/pages/before-flying/baggage/baggage-claim-form",
    phoneBaggage: "+966-920003777",
    phoneGeneral: "+966-920003777",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at baggage services immediately — complete PIR",
        "Get file reference number",
        "Track via WorldTracer at worldtracer.aero",
        "If not located in 10 days, submit claim form within 11 days",
        "Include itemized contents list with values"
      ],
      damaged: [
        "Report at baggage desk immediately — take photos",
        "Complete Damage Report",
        "File written claim within 7 days of issuing report"
      ],
      delayed: [
        "File PIR at airport baggage desk",
        "Track via WorldTracer",
        "Keep receipts for essential purchases",
        "Submit reimbursement claim"
      ],
    },
    documentation: [
      "PIR reference number",
      "Boarding pass and baggage claim tags",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for items and interim purchases"
    ],
    tips: [
      "Saudia uses WorldTracer for bag tracking (worldtracer.aero)",
      "10-day timeline: if bag not found in 10 days, submit claim within next 11 days",
      "Higher value can be declared at check-in for additional compensation",
      "Compensation limit: ~$2,050 USD (1,519 SDR) under Montreal Convention"
    ],
  },
  RO: {
    name: "TAROM",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from date luggage was made available" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "21 days" },
    },
    portalUrl: "https://www.tarom.ro/en/baggage-claims/",
    phoneBaggage: "1-844-415-3955",
    phoneGeneral: "1-844-415-3955",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at baggage services before leaving the airport",
        "Complete PIR and receive reference number",
        "File formal claim through tarom.ro/en/baggage-claims",
        "Include itemized contents list with values"
      ],
      damaged: [
        "Report at baggage desk immediately",
        "File written claim within 7 days",
        "Include photos of damage"
      ],
      delayed: [
        "File PIR at airport",
        "Keep receipts for essential purchases",
        "Submit reimbursement claim through tarom.ro"
      ],
    },
    documentation: [
      "PIR reference number",
      "Boarding pass and baggage claim tags",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for interim purchases"
    ],
    tips: [
      "US phone: 1-844-415-3955 / Canada: 1-855-413-1928",
      "Online claims portal at tarom.ro/en/baggage-claims",
      "Compensation limit: ~$2,080 USD under Montreal Convention"
    ],
  },
  ME: {
    name: "Middle East Airlines",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from receipt" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "21 days" },
    },
    portalUrl: "https://www.mea.com.lb/english/traveler-info/baggage-info/lost-and-found-baggage",
    phoneBaggage: "+961-1-629999",
    phoneGeneral: "+961-1-629999",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at baggage services counter immediately",
        "Complete PIR and receive reference number",
        "Written claim within 21 days to nearest MEA airport office",
        "Include itemized contents list"
      ],
      damaged: [
        "Report at baggage desk immediately",
        "Written claim within 7 days to nearest MEA airport office",
        "Include photos of damage"
      ],
      delayed: [
        "File PIR at airport",
        "Keep receipts for essential purchases",
        "Submit reimbursement claim to nearest MEA office"
      ],
    },
    documentation: [
      "PIR reference number",
      "Boarding pass and baggage claim tags",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for interim purchases"
    ],
    tips: [
      "Email: callcent@mea.com.lb for follow-up",
      "Claims go to nearest MEA airport office",
      "Compensation limit: ~$2,080 USD under Montreal Convention"
    ],
  },
  UX: {
    name: "Air Europa",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from receipt" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "21 days" },
    },
    portalUrl: "https://www.aireuropa.com/en/flights/manage-booking",
    phoneBaggage: "+34-911-401-501",
    phoneGeneral: "+34-911-401-501",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "Report at baggage services before leaving the airport",
        "Complete PIR and receive reference number",
        "File formal claim online or by phone",
        "Include itemized contents list with values"
      ],
      damaged: [
        "Report at baggage desk immediately",
        "File written claim within 7 days",
        "Include photos of damage"
      ],
      delayed: [
        "File PIR at airport",
        "Keep receipts for essential purchases",
        "Submit reimbursement claim"
      ],
    },
    documentation: [
      "PIR reference number",
      "Boarding pass and baggage claim tags",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for interim purchases"
    ],
    tips: [
      "Air Europa is a Spanish airline — phone support may be in Spanish first",
      "Compensation limit: ~$2,080 USD under Montreal Convention"
    ],
  },
  MF: {
    name: "Xiamen Airlines",
    deadlines: {
      damaged: { domestic: "N/A", international: "7 days from receipt" },
      delayed: { domestic: "N/A", international: "21 days from delivery" },
      lost: { domestic: "N/A", international: "21 days" },
    },
    portalUrl: "https://www.xiamenair.com/brandnew_EN/passenger-service/baggage-claim.html",
    phoneBaggage: "1-855-789-5557",
    phoneGeneral: "1-855-789-5557",
    processingDays: "14-30 days",
    steps: {
      lost: [
        "File at airport baggage counter immediately",
        "Complete PIR and receive reference number",
        "Contact via baggage inquiry department",
        "File formal claim if not recovered"
      ],
      damaged: [
        "Report at baggage counter immediately",
        "File written claim within 7 days",
        "Include photos of damage"
      ],
      delayed: [
        "File PIR at airport",
        "Keep receipts for essential purchases",
        "Submit reimbursement claim"
      ],
    },
    documentation: [
      "PIR reference number",
      "Boarding pass and baggage claim tags",
      "Photos of damage (for damaged claims)",
      "Itemized contents list with values",
      "Receipts for interim purchases"
    ],
    tips: [
      "US English line: 1-855-789-5557",
      "Code-share flights: operating carrier's baggage rules apply, not Xiamen's",
      "Compensation limit: Montreal Convention for international routes"
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
