#!/usr/bin/env /usr/local/bin/node
// ---------------------------------------------------------
// Installation
// ---------------------------------------------------------
// 1. Clone repo in your BitBar Enabled directory
// 2. Run npm install
// 3. Rename package.json to .package.json
// 4. Update var user_name = "";
// 5. Update var password = "";

var https = require("https");
var cheerio = require("cheerio");

var user_name = "xxx";
var password  = "xxx"
var domain    = "https://" + user_name + ":" + password + "@bitbucket.org";
var path      = "dashboard/pullrequests?section=reviewing";
var font_size = "13";
var prs       = [];

https.get(domain + "/" + path, function(res) {
  var body = "";
  res.on("data", function(chunk) {
    body += chunk;
  });
  res.on("end", function() {
    $ = cheerio.load(body);
    $("#pullrequests tbody tr").each(function(index) {
      var date = $(this).find(".date time").text();
      var user = $(this).find(".user a").attr("title");
      var pr = $(this).find(".flex-content--primary a").attr("title");
      var repo = $(this).find(".repo span").text();
      var link = $(this).find(".flex-content--primary a").attr("href");
      var approved = $(this).find(".flex-content--secondary").find("a.approved").attr("title");
      if (approved === undefined) {
        prs.push(date + " - " + repo + " - " + user + " - " + pr + " | href=" + domain + "" + link + " size=" + font_size);
      }
    });
    // Output
    console.log("(" + prs.length + ") BitBucket");
    console.log("---");
    prs.forEach(function(pr){
      console.log(pr);
    });
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});
