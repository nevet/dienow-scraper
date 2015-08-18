# DieNow Scraper
The scraper uses 2 main technologies: `CasperJS` and `NodeJS`. The basic workflow is:

1. Use `CasperJS` to crawl image URLs;
2. Use `NodeJS` to download image from corresponding URLs.

Directly using `Casper.download()` will cause an `XMLHttpRequest Exception 101`, and seems current work arounds are not that stable. THat's why I chose to pump the URL to a node server and let the server to handle the download request.

There are 2 version of scraper boundles: `casper-main-v1.js + server.js`, and `casper-main-v2.js + parser.js`.

Note: **This project is only tested on Mac OS X**.

# Pre-Requisites Installation
Regardless of the version, you need to get [`CasperJS`](http://docs.casperjs.org/en/latest/installation.html), [`PhantomJS`](http://phantomjs.org/download.html) and [`NodeJS`](https://nodejs.org/download/) installed.

An easy way to do installation is to install [`Homebrew`](brew.sh/) first, then use `brew` to install the rest:

```sh
brew update
brew install phantomjs
brew install casperjs
brew install node
```

# V1 (NOT Recommend)
In this version, all urls that crawled using `CasperJS` will be `POST` to a node server immediately after it's been crawled, and the server will handle the download asynchronously.

To run the app, navigate to your project folder, and install node dependencies first:

`npm install`

Next step is to start the node server:

`node server.js`

You should see `Server is Running!` if you ran correctly. The final step is to start the scraper:

`casperjs casper-main-v1.js`

The comic will be downloaded to `project_folder/dienow/chapter_name/page.jpg`.

# V2 (Preferred)
In this version, all urls that crawled using `CasperJS` will be written into a file, then a `NodeJS` based app will download the comic based on the urls.

To run the app, navigate to your project folder, and install node dependencies first:

`npm install`

Next step is to start the scraper:

`casperjs casper-main-v2.js`

After the scraping has been done, execute:

`node parser.js`

If you want to start the scraping from a specific chapter, execute:

`node parser.js [chapter_number]`

For example, if you want to start from chapter 103, execute:

`node parser.js 103`

The comic will be downloaded to `project_folder/dienow/chapter_name/page.jpg`.

# Future Development
1. Write scripts to automate V2;
2. Make downloading more reliable and faster, currently the speed is at *2s* per pic;
3. Generalize the code, so that user could donwload any comics from `u17.com`.

Please fork and send me PR if you want to help me solve these three issues :)
