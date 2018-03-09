/**
 * Created by smith on 4/17/2017.
 */
var wallpaper = require('wallpaper');
var q = require('q');
var request = require('request');
var queryString = require('query-string');
var path = require('path');
var Winreg = require('winreg');
var fs = require('fs');
var config = require('./requests.js');
var api = {};

var hKey = new Winreg({
    hive: Winreg.HKCU,
    key: '\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
});

// Get image from bing
api.getBingImage = function () {
    return q.Promise(function (resolve, reject, notify) {
        request(config.urlBing, function (error, response, body) {
            if (error) reject(error);
            var jsonImage = JSON.parse(body).images[0];
            var writeStream = fs.createWriteStream('resources/images/ImageOfTheDay.jpg');
            request('http://www.bing.com' + jsonImage.url).pipe(writeStream);
            writeStream.on('finish', function () {
                resolve('jpg');
            });
            writeStream.on('error', function () {
                reject("Unable to write to file");
            });
        });
    });
};

// Set desktop wallpaper
api.setWallpaper = function (format) {
    return wallpaper.set('./resources/images/ImageOfTheDay.' + format, {scale: 'fill'});
};

api.getWallpaper = function () {
    return wallpaper.get();
};

// Windows Launch functions
api.launchStatus = function () {
    return q.Promise(function (resolve, reject) {
        if (process.platform === "win32") {
            hKey.get('NodeWallpaper', function (error, item) {
                resolve(item !== null);
            });
        }
        else {
            reject("Platform Incorrect: " + process.platform);
        }
    });
};

api.enableStartLaunch = function () {
    return q.Promise(function (resolve, reject) {
        if (process.platform === "win32") {
            hKey.set('NodeWallpaper', Winreg.REG_SZ, '"' + path.join(__dirname, 'WallpaperService.vbs') + '"', function () {
                resolve();
            });
        }
        else {
            reject("Platform Incorrect: " + process.platform);
        }
    });
};

api.disableStartLaunch = function () {
    return q.Promise(function (resolve, reject, notify) {
        if (process.platform === "win32") {
            hKey.remove('NodeWallpaper', function () {
                resolve();
            });
        }
        else {
            reject("Platform Incorrect: " + process.platform);
        }
    });
};

module.exports = api;