var fs = require("fs");
var mkdirp = require("mkdirp");
var request = require("request");
var http = require("http");
var queryString = require('querystring');

function download(url, dir, filename) {
  request(url).pipe(fs.createWriteStream(dir + "/" + filename + ".jpg"));
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

console.log("Server is Running!");

http.createServer(function(req, res){
  req.on('data', function(data) {
    var parsed = queryString.parse(data.toString());
    
    var chapter = parsed.chapter;
    var pageNumber = parsed.page;
    var url = parsed.url;

    console.log("Chapter: " + chapter + "\t\tPage: " + pageNumber + " is on the way");
    // create folder
    var dir = makeDir("./dienow", chapter);
    download(url, dir, pageNumber);

    res.writeHead(200, "OK", {'Content-Type': 'text/html'});
    res.end("");
  });
}).listen(8080);

