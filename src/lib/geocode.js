const _ = require('lodash');
const googleMaps = require('@google/maps');

const { GOOGLE_API_KEY } = process.env;

const googleMapsClient = googleMaps.createClient({
  key: GOOGLE_API_KEY,
  Promise,
});

function parseGeocodeResult(result) {
  const addressComponents = {};

  if (!result) {
    return {
      addressComponents: null,
      formattedAddress: null,
      googlePlusCode: null,
      googlePlaceId: null,
      lat: null,
      lng: null
    };
  }

  result.address_components.forEach((addressComponent) => {
    let field;
    let fieldForm = 'short_name';

    if (_.includes(addressComponent.types, 'street_number')) {
      field = 'streetNumber';
    } else if (_.includes(addressComponent.types, 'route')) {
      field = 'route';
    } else if (_.includes(addressComponent.types, 'locality')) {
      field = 'locality';
      fieldForm = 'long_name';
    } else if (_.includes(addressComponent.types, 'neighborhood')) {
      field = 'neighborhood';
      fieldForm = 'long_name';
    } else if (_.includes(addressComponent.types, 'postal_code')) {
      field = 'postalCode';
    } else if (_.includes(addressComponent.types, 'postal_code_suffix')) {
      field = 'postalCodeSuffix';
    } else if (_.includes(addressComponent.types, 'administrative_area_level_1')) {
      field = 'state';
    } else if (_.includes(addressComponent.types, 'administrative_area_level_2')) {
      field = 'county';
    } else {
      // Ignore this field.
      return;
    }

    addressComponents[field] = addressComponent[fieldForm];
  });

  const formattedAddress = result.formatted_address;
  const googlePlaceId = result.place_id;
  const googlePlusCode = _.get(result, 'plus_code.global_code');
  const lat = _.get(result, 'geometry.location.lat');
  const lng = _.get(result, 'geometry.location.lng');

  return {
    addressComponents,
    formattedAddress,
    googlePlusCode,
    googlePlaceId,
    lat,
    lng,
  };
};

async function geocodeAddress({ address }) {
  let response = null;
  try {
    response = await googleMapsClient.geocode({ address }).asPromise();
  } catch (e) {
    return e;
  }

  console.log(JSON.stringify(response, null, 2));
  const { results } = response.json;

  return parseGeocodeResult(results[0]);
};

module.exports = {
  geocodeAddress,
  parseGeocodeResult,
}