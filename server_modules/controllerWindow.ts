/// <reference path="../dts/node/node.d.ts" />
import imageM = require("./imageLoadModule");
import imageM2 = require("./imageModifyModule");
import socketM = require("./socketModule");
import oauthM = require("./oauthModule");

export class ControllerWindow {
    private static _instance:ControllerWindow;

    public static getInstance():ControllerWindow {
        if (!this._instance) {
            this._instance = new ControllerWindow(ControllerWindow.getInstance);
        }
        return this._instance;
    }

    private imageLoadAPI:imageM.ImageLoadAPI;
    private imageModifyAPI:imageM2.ImageModifyAPI;
    private socketAPI:socketM.SocketIOAPI;
    private oauthAPI:oauthM.OAuthAPI;

    constructor(caller:Function = null) {
        if (caller == ControllerWindow.getInstance) {
            this.imageLoadAPI = imageM.ImageLoadAPI.getInstance();
            this.socketAPI = socketM.SocketIOAPI.getInstance();
            this.oauthAPI = oauthM.OAuthAPI.getInstance();
            this.imageModifyAPI = imageM2.ImageModifyAPI.getInstance();
        }
        else {
            throw new Error("直接インスタンス化はできません。");
        }
    }

    public init():void
    {
        // 画像のリクエストイベント
        this.socketAPI.getFromClient("imageRequestFromController", (data) => {
            var twitterID:string = data["twitterID"];
            this.oauthAPI.getProfileImageURL(twitterID, (userName:string, imageURL:string) => {
                if(imageURL != "")
                {
                    this.imageLoadAPI.requestImage(userName, imageURL, (data) => this.imageLoadHandler(userName, data));
                }
                else
                {
                }
            });
        });
    }

    private imageLoadHandler(userName:string, data:string):void {
        var baloonData:string = this.imageModifyAPI.createBaloon(userName);
        var spriteSheetData:string = this.imageModifyAPI.createSpriteSheet(data);
        this.socketAPI.emitToClient("imageGetComplete");
        this.socketAPI.emitToAllClients("imageGetEvent", {"baloonData":baloonData, "imageData": spriteSheetData});
    }
}
