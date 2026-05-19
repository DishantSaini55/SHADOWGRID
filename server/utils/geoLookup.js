import axios from 'axios';

function isLocalIp(ip) {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

export async function geoLookup(ip) {
  try {
    if (!ip || isLocalIp(ip)) {
      return {
        country: 'Local Development',
        countryCode: 'LO',
        city: 'Localhost',
        isp: 'Local Network',
        org: 'Development Machine',
        lat: 0,
        lon: 0,
        query: ip || '127.0.0.1'
      };
    }

    const response = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 1000 });
    const data = response.data || {};

    return {
      country: data.country || '',
      countryCode: data.countryCode || '',
      city: data.city || '',
      isp: data.isp || '',
      org: data.org || '',
      lat: data.lat ?? null,
      lon: data.lon ?? null,
      query: data.query || ip
    };
  } catch (error) {
    return {};
  }
}
