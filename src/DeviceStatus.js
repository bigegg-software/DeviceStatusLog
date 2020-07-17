const address = require('address');
const os = require('os');
const nslookup = require('nslookup');
const ping = require('ping');

class DeviceStatus {

    async getAddress(interfaceName) {
        let interfaces = await this.getInterfaces();
        return {name: interfaceName, addresses: interfaces[interfaceName]};
    }

    async getInterfaces() {
        return os.networkInterfaces();
    }

    async getAllAddress() {
        let result = [];
        let interfaces = await this.getInterfaces();
        for (let i in interfaces) {
            let ip = await this.getAddress(i);
            result.push(ip);
        }
        return Promise.resolve(result);
    }

    reboot() {
        const exec = require('child_process').exec;
        exec('sudo reboot', function callback(error, stdout, stderr) {
            console.log("reboot")
        });
        return Promise.resolve();
    }

    async resolveDNS(domain, dnsServer = "114.114.115.115") {
        return new Promise((resolve, reject) => {
            nslookup(domain)
                .server(dnsServer) // default is 8.8.8.8
                .timeout(10 * 1000) // default is 3 * 1000 ms
                .end(function (err, ips) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve({domain, ips});
                });
        });
    }

    async ping(ipAddress) {
        let result = await ping.promise.probe(ipAddress, {timeout: 10, extra: ['-i', '5']});
        delete result.output;
        return Promise.resolve(result);
    }

}

module.exports = DeviceStatus;