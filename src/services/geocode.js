import axios from 'axios';

export async function reverseGeocode({latitude, longitude}) {
  const url = 'https://nominatim.openstreetmap.org/reverse';
  const params = {
    lat: latitude,
    lon: longitude,
    format: 'json',
    addressdetails: 1,
  };
  const headers = {
    'User-Agent': 'CasualDateApp/1.0 (dev@CasualDateApp.com)',
    Referer: 'https://CasualDateApp.com', // helps OSM track requests
  };

  const {data} = await axios.get(url, {params, headers});
  const addr = data.address || {};

  return {
    country: addr.country,
    state: addr.state || addr.county,
    city: addr.city || addr.town || addr.village,
    postalCode: addr.postcode,
    place: data.display_name,
  };
}

// import axios from 'axios';
// const API_KEY = 'YOUR_GOOGLE_API_KEY';

// export async function reverseGeocode({latitude, longitude}) {
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;
//   const {data} = await axios.get(url);
//   const comp = data.results[0].address_components;
//   const find = type => comp.find(c => c.types.includes(type))?.long_name;
//   return {
//     country: find('country'),
//     state: find('administrative_area_level_1'),
//     city: find('locality') || find('administrative_area_level_2'),
//     postalCode: find('postal_code'),
//     place: data.results[0].formatted_address,
//   };
// }
