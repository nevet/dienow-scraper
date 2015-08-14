var casper = require ("casper").create({
  pageSettings: {
    loadImages:  false,
    loadPlugins: false
  },
  verbose: true
});
var fs = require("fs");

var fileName = "./urls.txt";

casper.on('complete.error', function(err) {
    this.die("Complete callback has failed: " + err);
});

casper.on('error', function(msg, trace) {
    this.die("Caught in Error: " + msg + "\n" + trace.toString());
});

casper.on('resource.error', function(resErr) {
    this.die("Resource Error: " + resErr.errorString + "\nResource Url: " + resErr.url);
});

var comicNumber = 13707;
var url = "http://www.u17.com/comic/" + comicNumber + ".html";

var chapters = [];
var pages = [];

function findChapters() {
  var links = document.querySelectorAll('div.chapterlist_box li a');

  return Array.prototype.map.call(links, function(e) {
      return e.getAttribute("href");
  });
}

function findInitialPages() {
  var links = document.querySelectorAll("img[id^='cur_img_']");

  return Array.prototype.map.call(links, function(e) {
      return e.getAttribute("data-src");
  });
}

casper.start(url);

casper.then(function () {
  console.log("Connected! Current Url = " + this.getCurrentUrl());

  if (this.exists("div.comic_info h1.fl")) {
    this.echo(this.fetchText("div.comic_info h1.fl").trim());
    chapters = this.evaluate(findChapters);
    console.log("Found " + chapters.length + " chapters in total.");
  } else {
    this.echo("Comic " + comicNumber + " not found!");
  }
});

casper.then(function () {
  this.each(chapters, function (self, chapter) {
    // for each chapter, open the chapter to view the pages
    self.thenOpen(chapter, function () {
      var chapterName = this.fetchText("#current_chapter_name");

      console.log("Now processing " + this.getCurrentUrl());
      console.log("Chapter Name: " + chapterName);
      fs.write(fileName, chapterName + "\n", 'a');

      // get the page number
      var regex = /\/(\d+)/g;
      var pageCount = parseInt(regex.exec(this.fetchText(".pagenum"))[1]);
      
      console.log("Total Pages: " + pageCount);
      console.log("Start downloading...");

      // get the initial pages
      pages = this.evaluate(findInitialPages);

      fs.write(fileName, pages.join("\n") + "\n", 'a');
      console.log(pages.join("\n"));

      this.then(function () {
        this.repeat(pageCount - 3, function () {
          this.thenClick("#image_trigger");

          this.then(function () {
            var next = this.evaluate(function () {
              var links = document.querySelectorAll("img[id^='cur_img_']");
              return links[links.length - 1].getAttribute("data-src");
            });

            fs.write(fileName, next + "\n", 'a');
            console.log(next);
          });
        });
      });
    })
  });
});

casper.run(function () {
  this.echo('done').exit();
});