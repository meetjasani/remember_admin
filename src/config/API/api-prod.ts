const protocol = 'https';
const host = '192.168.10.105';
const port = '5001';
const trailUrl = 'api';

const hostUrl = `${protocol}://${host}${port ? ':' + port : ''}/`;
const endpoint = `${protocol}://${host}${(port ? ':' + port : '')}/${trailUrl}`;

export default {
    protocol: protocol,
    host: host,
    port: port,
    apiUrl: trailUrl,
    endpoint: endpoint,
    hostUrl: hostUrl
};
