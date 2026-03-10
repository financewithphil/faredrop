const Amadeus = require("amadeus");

let amadeus;

function getClient() {
  if (!amadeus) {
    amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
    });
  }
  return amadeus;
}

async function checkPrice(flight) {
  const client = getClient();

  const params = {
    originLocationCode: flight.origin,
    destinationLocationCode: flight.destination,
    departureDate: flight.departure_date,
    adults: flight.passengers || 1,
    currencyCode: flight.currency || "USD",
    max: 10,
  };

  // Filter by airline if we have the code
  if (flight.airline_code) {
    params.includedAirlineCodes = flight.airline_code;
  }

  // Map fare class to travel class
  if (flight.fare_class) {
    const classMap = {
      economy: "ECONOMY",
      premium_economy: "PREMIUM_ECONOMY",
      business: "BUSINESS",
      first: "FIRST",
    };
    const mapped = classMap[flight.fare_class.toLowerCase()];
    if (mapped) params.travelClass = mapped;
  }

  let response = await client.shopping.flightOffersSearch.get(params);
  let offers = response.data;

  // Fallback: if airline-specific search returned nothing, try all airlines
  if ((!offers || offers.length === 0) && params.includedAirlineCodes) {
    const fallbackParams = { ...params };
    delete fallbackParams.includedAirlineCodes;
    response = await client.shopping.flightOffersSearch.get(fallbackParams);
    offers = response.data;
  }

  if (!offers || offers.length === 0) {
    return null;
  }

  // Find the cheapest offer
  let cheapest = null;
  for (const offer of offers) {
    const price = parseFloat(offer.price.total);
    if (!cheapest || price < cheapest) {
      cheapest = price;
    }
  }

  return {
    currentPrice: cheapest,
    currency: offers[0].price.currency || "USD",
    offersFound: offers.length,
  };
}

module.exports = { checkPrice };
