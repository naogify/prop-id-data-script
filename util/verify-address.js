const axios = require('axios')

async function verifyAddress(addressListString) {
  // Use first address
  const addresses = addressListString.split(';');
  const address = addresses[0] || '';
  const endpoint = process.env.INCREMENTP_VERIFICATION_API_ENDPOINT;
  const apiKey = process.env.INCREMENTP_VERIFICATION_API_KEY;
  const url = `${endpoint}/${encodeURIComponent(address)}.json?geocode=true`;
  const headers = {
    'x-api-key': apiKey,
    'user-agent': 'geolonia-prop-id/1.0',
  };

  const res = await axios.get(url, {
    headers,
    validateStatus: (status) => ( status < 500 ),
  });

  return ({
    body: res.data,
    status: res.status,
    ok: res.status === 200,
    headers: res.headers,
  });
};

module.exports.verifyAddress = verifyAddress