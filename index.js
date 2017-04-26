/**
 * Created by smith on 4/17/2017.
 */
var q = require('q');
var api = require('./api.js');
var fs = require('fs');

var oldDate = new Date(fs.readFileSync('resources/misc/date.txt')).toDateString();
var date = new Date().toDateString();

q.fcall(function () {
    if (process.env.NODE_ENV === 'development') {
        console.log("Running Development");
    }
    else if (process.env.NODE_ENV === 'add' && oldDate !== date) {
        return api.launchStatus().then(function (result) {
            if (result === false) {
                return api.enableStartLaunch();
            }
        });
    }
    else if (process.env.NODE_ENV === 'remove') {
        return api.launchStatus().then(function (result) {
            if (result) {
                return api.disableStartLaunch().then(function () {
                    throw "Disabled Start On Launch";
                });
            }
            else {
                throw "NodeWallpaper is not started";
            }
        });
    }
    else {
        throw "Is up to date";
    }
}).then(function () {
    return api.getBingImage();
    // return api.getFlickrSearchImage();
}).then(function (format) {
    return api.setWallpaper(format);
    // api.getWallpaper();
}).then(function (result) {
    fs.writeFileSync('resources/misc/date.txt', date);
    console.log("Complete!");
}).catch(function (error) {
    console.log(error);
});