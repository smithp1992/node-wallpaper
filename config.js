/**
 * Created by smith on 4/26/2017.
 */
/**
 * Created by smith on 4/21/2017.
 */
var queryString = require('query-string');
var fs = require('fs');
var path = require('path');

var offset = fs.readFileSync(path.join(__dirname, '/resources/misc/offset.txt'), 'utf8') || 0;

var queryBing = queryString.stringify({
    format: 'js', // JSON format
    idx: offset, // Day index
    n: 1, // Number of images
    mkt: 'en-US' // Region
});

exports.urlBing = {
    url: 'http://www.bing.com/HPImageArchive.aspx?' + queryBing // Bing Search
};