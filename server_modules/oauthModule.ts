/// <reference path="../dts/node/node.d.ts" />;
var OAuth = require('oauth');

export class OAuthAPI {
    private static _instance:OAuthAPI;
    private CONSUMER_KEY:string = "Your Consumer Key";
    private APP_SECRET:string = "Your App Secret";
    private END_POINT:string = "https://api.twitter.com/1.1/";
    private USER_TOKEN:string = "Your Token";
    private USER_SECRET:string = "Your Secret";


    private _oauth;

    public static getInstance():OAuthAPI {
        if (!this._instance) {
            this._instance = new OAuthAPI(OAuthAPI.getInstance);
        }
        return this._instance;
    }

    constructor(caller:Function = null) {
        if (caller == OAuthAPI.getInstance) {
            this.initOAuth();
        }
        else {
            throw new Error("直接インスタンス化はできません。");
        }
    }

    private initOAuth():void {
        this._oauth = new OAuth.OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            this.CONSUMER_KEY,
            this.APP_SECRET,
            '1.0A',
            null,
            'HMAC-SHA1'
        );
    }

    private getData(apiName:string, query:string, callBack:Function = null) {
        if (!this._oauth) {
            console.error("oauthが存在しません");
        }

        var requestURL:string = this.END_POINT + apiName + "?" + query;
        console.log("twitter API call " + requestURL);
        this._oauth.get(
            requestURL,
            this.USER_TOKEN, //test user token
            this.USER_SECRET,   //test user secret
            function (e, data, res) {
                if (e) console.error(e);
                var obj = JSON.parse(data);
                if(callBack)
                {
                    console.log("twitter API call Success!");
                    callBack(obj);
                }
            });
    }

    public getProfileImageURL(screenName:string, callBack:Function) {
        this.getData("users/show.json", "screen_name=" + screenName, (data:Object) => {
            var imageURL:string = "";
            var name:string = "";
            if ("profile_image_url" in data) {
                imageURL = data["profile_image_url"];
            }
            if ("name" in data) {
                name = data["name"];
            }
            callBack(name, imageURL);
        });
    }
}

