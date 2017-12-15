const qiniu = require("qiniu");
const proc = require("process");
const path = require('path');

const platformConfig = require(path.resolve(`./config/${process.env.NODE_ENV}.qiniu.config`));

//URL 列表
var urlsToPrefetch = platformConfig.prefetch_urls;
var urlsToRefresh = platformConfig.refresh_urls;
var accessKey = platformConfig.accessKey;
var secretKey = platformConfig.secretKey;
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var cdnManager = new qiniu.cdn.CdnManager(mac);

var refresh_cdn = function (urls) {
  cdnManager.refreshUrls(urls, function(err, respBody, respInfo) {
    if (err) {
      throw err;
    }

    if (respInfo.statusCode == 200) {
      var jsonBody = JSON.parse(respBody);
      console.log("refresh", jsonBody.error);
    } else {
      console.log(jsonBody);
    }
  });
}

//预取链接
cdnManager.prefetchUrls(urlsToPrefetch, function(err, respBody, respInfo) {
  if (err) {
    throw err;
  }

  if (respInfo.statusCode == 200) {
    var jsonBody = JSON.parse(respBody);
    console.log("prefetch ", jsonBody.error);

    refresh_cdn(urlsToRefresh);
  } else {
    console.log(jsonBody);
  }
});
