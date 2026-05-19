const vpnKeywords = [
  'vpn',
  'nordvpn',
  'expressvpn',
  'mullvad',
  'protonvpn',
  'surfshark',
  'cyberghost',
  'privateinternetaccess',
  'pia',
  'ipvanish',
  'hidemyass',
  'windscribe',
  'tunnelbear'
];

const datacenterKeywords = [
  'amazon',
  'aws',
  'digitalocean',
  'linode',
  'vultr',
  'hetzner',
  'ovh',
  'google cloud',
  'microsoft azure',
  'cloudflare',
  'fastly',
  'akamai',
  'cdn'
];

const torExitIps = new Set([
  '185.220.101.1',
  '185.220.101.2',
  '185.220.101.3',
  '185.220.101.4',
  '185.220.101.5',
  '185.220.101.6',
  '185.220.101.7',
  '185.220.101.8',
  '185.220.101.9',
  '185.220.102.4',
  '185.220.102.5',
  '185.220.102.6',
  '185.220.102.7',
  '192.42.116.16',
  '45.84.107.0'
]);

export function vpnDetect(ip, isp = '', org = '') {
  const source = `${isp} ${org}`.toLowerCase();

  const vpnProviderMatch = vpnKeywords.find((keyword) => source.includes(keyword));
  const vpnDetected = Boolean(vpnProviderMatch);
  const datacenterIP = datacenterKeywords.some((keyword) => source.includes(keyword));
  const torDetected = torExitIps.has(ip);

  return {
    vpnDetected,
    torDetected,
    datacenterIP,
    vpnProvider: vpnProviderMatch || null
  };
}
