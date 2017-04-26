/**
 * Created by smith on 4/26/2017.
 */
/**
 * Created by smith on 4/21/2017.
 */
var queryString = require('query-string');
var fs = require('fs');
var path = require('path');
var config = require('./config/config.js');

var offset = fs.readFileSync(path.join(__dirname, '/resources/misc/offset.txt'), 'utf8') || 0;

var queryFlickrSearch = queryString.stringify({
    method: 'flickr.photos.search', // Flickr Api method (search)
    text: fs.readFileSync(path.join(__dirname, '/search.txt'), "utf8"), // Search
    format: 'json',
    nojsoncallback: 1,
    api_key: config.apiKeyFlickr, // Flickr api key
    group_id: '40961104@N00', // Group to search from
    sort: 'relevance', // Get the most interesting first
    per_page: 1, // Amount per page
    page: Math.floor(Math.random() * (offset / 2)) // Page number
});

var queryBing = queryString.stringify({
    format: 'js', // JSON format
    idx: 0, // Day index
    n: 1, // Number of images
    mkt: 'en-US' // Region
});

exports.urlFlickrInfo = function (params) {
    return 'https://api.flickr.com/services/rest/?' + queryString.stringify({
            method: 'flickr.photos.getInfo', // Flickr Api method (search)
            format: 'json',
            nojsoncallback: 1,
            api_key: config.apiKeyFlickr, // Flickr api key
            photo_id: params.id,
            secret: params.secret
        });
};

exports.urlFlickrSearch = {
    url: 'https://api.flickr.com/services/rest/?' + queryFlickrSearch
};

exports.urlBing = {
    url: 'http://www.bing.com/HPImageArchive.aspx?' + queryBing // Bing Search
};