// =============================Dependencies====================================
// file utils
var fs = require('fs');
var mkdirp = require('mkdirp');

// dynamic scraper
var Browser = require('zombie');

// static html process
var request = require("request");
var cheerio = require("cheerio");
// ==========================End Dependencies===================================

var url = 'http://www.u17.com/comic/';
var comicSN = 13707;
var completeUrl = makeUrl(url, comicSN);

var rootDir = "./";
var dir;

// ===========================Helper Functions==================================
function auto(page) {
  var counter = 0;
  var timer = setInterval(function () {
    next();
    counter ++;

    if (counter >= page) {
      closeInterval(timer);
    }
  }, 3000);
}

function crawlChapter(obj, parentFolder) {
  // skip vip
  if (obj.hasClass("vip_chapter")) return;

  title = obj.attr("title");
  chapterLink = obj.attr("href");

  var curFolder = makeDir(parentFolder, title);

  console.log("Crawling " + title);
  console.log("href = " + chapterLink);

  var comic = new Browser();

  comic.visit(chapterLink, function () {
    console.log(comic.query("div"));
    comic.query("#image_trigger").click();
    
    setTimeout(function () {
      console.log(comic.resources);
    }, 1000);
  })
}

function getPageCount($) {
  var regex = /\/(\d+)/g;
  var matches = regex.exec($(".pagenum").text());

  return matches[1];
}

function makeUrl(url, comic) {
  return url + comic + ".html";
}

function makeDir(root, title) {
  dir = root + "/" + title;

  mkdirp(dir, function(err) {
    if(err){
      console.log(err);
    }
  });

  return dir;
}

function next($) {
  $("#image_trigger").click();
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

    var curRoot = makeDir(rootDir + "comic", comicTitle);

    console.log("Root folder created...");

    // $("div.chapterlist_box li a").each(function () {
    //   crawlChapter($(this), curRoot);
    // })
    crawlChapter($($("div.chapterlist_box li a")[0]), curRoot);
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