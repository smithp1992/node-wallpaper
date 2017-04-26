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
var config = require('./config/config.js');
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

api.getFlickrSearchImage = function () {
    return q.Promise(function (resolve, reject, notify) {
        request(config.urlFlickrSearch, function (error, response, body) {
            if (error) reject(error);
            body = JSON.parse(body);
            fs.writeFileSync(path.join(__dirname, '/resources/misc/offset.txt'), body.photos.total);
            request(config.urlFlickrInfo(body.photos.photo[0]), function (error, response, body) {
                if (error) reject(error);
                var jsonImage = JSON.parse(body).photo;
                var url;
                if (jsonImage.originalformat) {
                    url = 'https://farm' + jsonImage.farm + // farm-id
                        '.staticflickr.com/' + jsonImage.server + // server-id
                        '/' + jsonImage.id + // image-id
                        '_' + jsonImage.originalsecret + // secret
                        '_o.' + jsonImage.originalformat; // Image format of original photo
                }
                else {
                    jsonImage.originalformat = 'jpg';
                    url = 'https://farm' + jsonImage.farm + // farm-id
                        '.staticflickr.com/' + jsonImage.server + // server-id
                        '/' + jsonImage.id + // image-id
                        '_' + jsonImage.secret + // secret
                        '_h.' + jsonImage.originalformat; // Image format of original photo
                }
                var writeStream = fs.createWriteStream('resources/images/ImageOfTheDay.' + jsonImage.originalformat);
                request(url).pipe(writeStream); // size of image (h=large)
                writeStream.on('finish', function () {
                    resolve(jsonImage.originalformat);
                });
                writeStream.on('error', function () {
                    reject("Unable to write to file");
                });
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