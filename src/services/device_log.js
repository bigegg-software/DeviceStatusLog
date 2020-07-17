const _ = require("underscore");
const logger = require('../Logger').getLogger('device_status');

function LOG_ACTION(action, obj = {}) {
    return JSON.stringify(Object.assign(obj, {action}));
}

const DeviceStatus = require('../DeviceStatus');
const status = new DeviceStatus();
const CHECK_INTERVAL = 30e3;
const TARGET_HOST = '114.114.115.115';
const TARGET_DOMAIN = 'baidu.com';

function getDefaultIp(interfaces) {
    let ipList = _.findWhere(interfaces, {name: "en0"});
    return ipList ? (ipList.addresses ?
        _.findWhere(ipList.addresses, {family: "IPv4"}) : undefined)
        : undefined;
}

async function logDeviceStatus() {
    let allInterfaces = await status.getAllAddress();
    let lanIP = getDefaultIp(allInterfaces);
    logger.info(LOG_ACTION('ip', lanIP));

    let result = await status.ping(TARGET_HOST);
    logger.info(LOG_ACTION('ping', result));

    let resolved = await status.resolveDNS(TARGET_DOMAIN);
    logger.info(LOG_ACTION('dns', resolved));
}

setInterval(logDeviceStatus, CHECK_INTERVAL);
// logDeviceStatus();