// =============================Dependencies====================================
// file utils
var fs = require('fs');
var mkdirp = require('mkdirp');

// dynamic scraper
var zombie = require('zombie');

// static html process
var request = require("request");
var cheerio = require("cheerio");
// ==========================End Dependencies===================================

// target url
var url = 'http://';

// local storage
var dir = './images';

// make dir
mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});

// helper functions
var download = function(url, dir, filename){
    request.head(url, function(err, res, body){
        request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};

// send request
request(url, function(error, response, body) {
    if(!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        $('.img img').each(function() {
            var src = $(this).attr('src');
            console.log('正在下载' + src);
            download(src, dir, Math.floor(Math.random()*100000) + src.substr(-4,4));
            console.log('下载完成');
        });
    }
});