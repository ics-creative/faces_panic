/// <reference path="../dts/node/node.d.ts" />;

import http = require("http");
import https = require("https");
import imageM2 = require("./imageModifyModule");

export class ImageLoadAPI {
    private static _instance:ImageLoadAPI;

    public static getInstance():ImageLoadAPI {
        if (!this._instance) {
            this._instance = new ImageLoadAPI(ImageLoadAPI.getInstance);
        }
        return this._instance;
    }

    private imageModifyAPI:imageM2.ImageModifyAPI;

    constructor(caller:Function = null) {
        if (caller == ImageLoadAPI.getInstance) {
            this.imageModifyAPI = imageM2.ImageModifyAPI.getInstance();
        }
        else {
            throw new Error("直接インスタンス化はできません。");
        }
    }

    public requestImage(userName:string, url:string, callBack:Function = null):void {
        var module;
        if (url.indexOf("https") >= 0) {
            module = https;
        }
        else {
            module = http;
        }

        url = url.replace("_normal","_bigger");
        console.log("requestImage is " + url);
        
        module.get(url, (response:http.ClientResponse) => {
            var type = response.headers["content-type"];
            var body = "";
            var pngPrefix:string = "data:image/png;base64,";
            response.setEncoding('binary');
            response.on('end', () => {
                var buffer = new Buffer(body, 'binary');
                var data:string;
                if(type == "image/png")
                {
                    var base64:string = new Buffer(body, 'binary').toString('base64');
                    data = pngPrefix + base64;

                    if (callBack != null) {
                        callBack(data);
                    }
                }
                else
                {
                    this.imageModifyAPI.convertToPng(type, buffer,
                        (base64data) => {
                            data = pngPrefix + base64data;
                            if (callBack != null) {
                                callBack(data);
                            }
                        },
                        () => {
                        console.log("error")
                    });
                }
            });
            response.on('data', function (chunk) {
                if (response.statusCode == 200) body += chunk;
            });
        });
    }

}