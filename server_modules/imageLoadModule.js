/// <reference path="../dts/node/node.d.ts" />;
var http = require("http");
var https = require("https");
var imageM2 = require("./imageModifyModule");
var ImageLoadAPI = (function () {
    function ImageLoadAPI(caller) {
        if (caller === void 0) { caller = null; }
        if (caller == ImageLoadAPI.getInstance) {
            this.imageModifyAPI = imageM2.ImageModifyAPI.getInstance();
        }
        else {
            throw new Error("直接インスタンス化はできません。");
        }
    }
    ImageLoadAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new ImageLoadAPI(ImageLoadAPI.getInstance);
        }
        return this._instance;
    };
    ImageLoadAPI.prototype.requestImage = function (userName, url, callBack) {
        var _this = this;
        if (callBack === void 0) { callBack = null; }
        var module;
        if (url.indexOf("https") >= 0) {
            module = https;
        }
        else {
            module = http;
        }
        url = url.replace("_normal", "_bigger");
        console.log("requestImage is " + url);
        module.get(url, function (response) {
            var type = response.headers["content-type"];
            var body = "";
            var pngPrefix = "data:image/png;base64,";
            response.setEncoding('binary');
            response.on('end', function () {
                var buffer = new Buffer(body, 'binary');
                var data;
                if (type == "image/png") {
                    var base64 = new Buffer(body, 'binary').toString('base64');
                    data = pngPrefix + base64;
                    if (callBack != null) {
                        callBack(data);
                    }
                }
                else {
                    _this.imageModifyAPI.convertToPng(type, buffer, function (base64data) {
                        data = pngPrefix + base64data;
                        if (callBack != null) {
                            callBack(data);
                        }
                    }, function () {
                        console.log("error");
                    });
                }
            });
            response.on('data', function (chunk) {
                if (response.statusCode == 200)
                    body += chunk;
            });
        });
    };
    return ImageLoadAPI;
})();
exports.ImageLoadAPI = ImageLoadAPI;
