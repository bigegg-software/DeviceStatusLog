const Log4js = require("log4js");
Log4js.addLayout('json', function (config) {
    return function (logEvent) {
        return JSON.stringify(logEvent) + config.separator;
    }
});

Log4js.configure({
    appenders: {
        device_status: {
            type: "file", filename: "./device_status.log", layout: {type: 'json', separator: ','},
            maxLogSize: 1024 * 1024 * 10, backups: 1
        },
        autoreboot: {
            type: "file", filename: "./autoreboot.log", layout: {type: 'json', separator: ','},
            maxLogSize: 1024 * 1024 * 10, backups: 1
        },
        console: {type: 'console'}
    },
    categories: {
        device_status: {appenders: ["device_status"], level: "info"},
        autoreboot: {appenders: ["autoreboot"], level: "info"},
        default: {appenders: ['console'], level: 'info'}
    }
});

module.exports = {
    getLogger: (logName) => {
        return Log4js.getLogger(logName);
    }
}