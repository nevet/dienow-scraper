var fs = require("fs");
var mkdirp = require("mkdirp");
var request = require("request");

function download(url, dir, filename) {
  try {
    request(url).pipe(fs.createWriteStream(dir + "/" + filename + ".jpg"));
  } catch (err) {
    console.log("download err! retry...");
    download(url, dir, filename);
  }
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

var root = "./dienow";
var curDir = "";

var curChapter = "";
var startChapter = 0;
var chapter = 0;
var page = 1;
var index = 0;

var urls = fs.readFileSync('urls.txt').toString().split("\n");

if (process.argv.length == 3) {
  try {
    startChapter = parseInt(process.argv[2]);
  }
  catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

console.log("Moving to chapter " + startChapter);

while (index < urls.length && chapter < startChapter) {
  var value = urls[index ++];

  if (value.indexOf("http") == -1) {
    // skip chapter
    curChapter = value;
    chapter ++;

    console.log("Skipping chapter " + chapter + ": " + curChapter);
  }
}

curDir = makeDir(root, urls[index - 1]);

var timer = setInterval(function () {
  var value = urls[index ++];

  if (value.indexOf("http") == -1) {
    // set chapter, reset page count
    curChapter = value;
    page = 1;
    chapter ++;

    // make dir
    curDir = makeDir(root, value);

    console.log("Starting chapter " + chapter + ": " + curChapter);
  } else {
    console.log("Donwloading page " + page);
    download(value, curDir, page);
    page ++;
  }

  if (index == urls.length) {
    clearInterval(timer);
  }
}, 2000);