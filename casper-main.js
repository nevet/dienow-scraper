var casper = require ("casper").create({
  clientScripts:  [
    'include/jquery.js'
  ],
  pageSettings: {
    loadImages:  false,
    loadPlugins: false
  },
  verbose: true
});

var comicNumber = 13707;
var url = "http://www.u17.com/comic/" + comicNumber + ".html";

var chapters = [];
var pages = [];

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function findChapters() {
  var links = $('div.chapterlist_box li a');

  return Array.prototype.map.call(links, function(e) {
      return e.getAttribute("href");
  });
}

function findInitialPages() {
  var links = $("img[id^='cur_img_']");

  return Array.prototype.map.call(links, function(e) {
      return e.getAttribute("data-src");
  });
}

casper.on('resource.received', function(resource) {
  if (resource.contentType && resource.contentType.indexOf("image/webp") > -1) {
    casper.echo("Type = " + resource.contentType + "\nUrl = " + resource.url + "\n\n");
  }
});

casper.start(url);

casper.then(function () {
  this.echo("Connected! Current Url = " + this.getCurrentUrl());

  if (this.exists("div.comic_info h1.fl")) {
    this.echo(this.fetchText("div.comic_info h1.fl").trim());
    chapters = this.evaluate(findChapters).slice(0, 3);
  } else {
    this.echo("Comic " + comicNumber + " not found!");
  }
});

casper.then(function () {
  this.each(chapters, function (self, chapter) {
    self.thenOpen(chapter, function () {
      var chapterName = this.fetchText("#current_chapter_name");

      this.echo("Now processing " + this.getCurrentUrl());
      this.echo("Chapter Name: " + chapterName);

      if (this.exists("#image_trigger")) {
        var regex = /\/(\d+)/g;
        var pageCount = parseInt(regex.exec(this.fetchText(".pagenum"))[1]);
        
        this.echo("Total Pages: " + pageCount);

        if (this.exists("img[id^='cur_img_']")) {
          this.echo("Start downloading...");

          pages = this.evaluate(findInitialPages);
          var counter = 1;

          this.each(pages, function (self, page) {
            self.echo("Downloading " + page);
            self.thenOpen("http://localhost:8080", {
              method: "post",
              data: {
                "chapter": chapterName,
                "page": counter++,
                "url": page
              }
            });
          });
        } else {
          this.echo("Can NOT download!");
        }
      } else {
        this.echo("Image Clicking Error!");
      }
    })
  });
});

casper.run(function () {
  this.echo(chapters.length + ' chapters found:');
  this.echo(' - ' + chapters.join('\n - ')).exit();
});