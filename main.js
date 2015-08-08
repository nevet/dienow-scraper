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

var url = 'http://www.u17.com/comic/';
var comicSN = 13707;
var completeUrl = makeUrl(url, comicSN);

var rootDir = ".";
var dir;

// ===========================Helper Functions==================================
function makeUrl(url, comic) {
  return url + comic + ".html";
}

function makeDir(root, title) {
  dir = rootDir + title;

  mkdirp(dir, function(err) {
    if(err){
      console.log(err);
    }
  });

  return dir
}
// =======================End Helper Functions==================================

// ================================Main=========================================
console.log("Crawling started...");

request(completeUrl, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log("Comic received, started analyzing...");

    // pipe the body to cheerio
    var $ = cheerio.load(body);
    var comicTitle = $("div.comic_info h1.fl").text().trim();

    console.log("Comic Title: " + comicTitle);

    makeDir(rootDir + "/comic", comicTitle);

    console.log("Root folder created...");

    $("div.chapterlist_box li a").each(function () {
      var chapterTitle = $(this).attr("title");
      
      // makeDir(dir, chapterTitle);
      console.log(chapterTitle);
    })
  }
})
// ==============================End Main=======================================


/*
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
});*/