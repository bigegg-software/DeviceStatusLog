const logger = require('../Logger').getLogger('autoreboot');


const ping = require('ping');

let failedCount = 0;
const CHECK_INTERVAL = 60e3;
const FAILED_THRESHOLD = 20;
const TARGET_HOST = '192.168.131.2';
// const TARGET_HOST = '114.114.115.115';

function LOG_ACTION(action, obj = {}) {
    return JSON.stringify(Object.assign(obj, {action}));
}

// TODO change to crontab
logger.info(LOG_ACTION('start'));
let checker = setInterval(() => {
    ping.promise.probe(TARGET_HOST)
        .then(function (res) {
            delete res.output;
            res.failedCount = failedCount;
            logger.info(LOG_ACTION('pong', res));
            if (res.alive) {
                failedCount = 0;
            } else {
                failedCount++;
            }
        });
    if (failedCount >= FAILED_THRESHOLD) {
        logger.info(LOG_ACTION('reboot', {failedCount}));
        const exec = require('child_process').exec;
        exec('sudo reboot', function callback(error, stdout, stderr) {
            logger.info(LOG_ACTION('reboot'));
            failedCount = 0;
        });
        clearInterval(checker);
    }
}, CHECK_INTERVAL);