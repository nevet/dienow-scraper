var casper = require ("casper").create();
var comicNumber = 13707;
var url = "http://www.u17.com/comic/" + comicNumber + ".html";

var chapters = [];
var pages = [];

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

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

casper.on('resource.received', function(resource) {
  if (resource.contentType && resource.contentType.indexOf("image/webp") > -1) {
    casper.echo("Type = " + resource.contentType + "\nUrl = " + resource.url + "\n\n");
  }
});

casper.start(url);

casper.echo("Connecting server...");

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
      this.echo("Now processing " + this.getCurrentUrl());
      this.echo("Chapter Name: " + this.fetchText("#current_chapter_name"));

      if (this.exists("#image_trigger")) {
        var regex = /\/(\d+)/g;
        var pageCount = parseInt(regex.exec(this.fetchText(".pagenum"))[1]);
        
        this.echo("Total Pages: " + pageCount);

        if (this.exists("img[id^='cur_img_']")) {
          this.echo("Start downloading...");

          pages = this.evaluate(findInitialPages);

          this.echo(' - ' + pages.join('\n - '));
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