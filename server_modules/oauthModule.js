/// <reference path="../dts/node/node.d.ts" />;
var OAuth = require('oauth');
var OAuthAPI = (function () {
    function OAuthAPI(caller) {
        if (caller === void 0) { caller = null; }
        // ==== Twitterのアプリ登録による設定に応じて書き換えてください。======
        this.CONSUMER_KEY = "your application consumer key";
        this.APP_SECRET = "your application secret";
        this.USER_TOKEN = "your user token for this app";
        this.USER_SECRET = "your user secret for this app";
        // ==== Twitterのアプリ登録による設定終わり======
        this.END_POINT = "https://api.twitter.com/1.1/";
        if (caller == OAuthAPI.getInstance) {
            this.initOAuth();
        }
        else {
            throw new Error("直接インスタンス化はできません。");
        }
    }
    OAuthAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new OAuthAPI(OAuthAPI.getInstance);
        }
        return this._instance;
    };
    OAuthAPI.prototype.initOAuth = function () {
        this._oauth = new OAuth.OAuth('https://api.twitter.com/oauth/request_token', 'https://api.twitter.com/oauth/access_token', this.CONSUMER_KEY, this.APP_SECRET, '1.0A', null, 'HMAC-SHA1');
    };
    OAuthAPI.prototype.getData = function (apiName, query, callBack) {
        if (callBack === void 0) { callBack = null; }
        if (!this._oauth) {
            console.error("oauthが存在しません");
        }
        var requestURL = this.END_POINT + apiName + "?" + query;
        console.log("twitter API call " + requestURL);
        this._oauth.get(requestURL, this.USER_TOKEN, this.USER_SECRET, function (e, data, res) {
            if (e)
                console.error(e);
            var obj = JSON.parse(data);
            if (callBack) {
                console.log("twitter API call Success!");
                callBack(obj);
            }
        });
    };
    OAuthAPI.prototype.getProfileImageURL = function (screenName, callBack) {
        this.getData("users/show.json", "screen_name=" + screenName, function (data) {
            var imageURL = "";
            var name = "";
            if ("profile_image_url" in data) {
                imageURL = data["profile_image_url"];
            }
            if ("name" in data) {
                name = data["name"];
            }
            callBack(name, imageURL);
        });
    };
    return OAuthAPI;
})();
exports.OAuthAPI = OAuthAPI;
