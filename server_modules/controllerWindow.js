/// <reference path="../dts/node/node.d.ts" />
var imageM = require("./imageLoadModule");
var imageM2 = require("./imageModifyModule");
var socketM = require("./socketModule");
var oauthM = require("./oauthModule");
var ControllerWindow = (function () {
    function ControllerWindow(caller) {
        if (caller === void 0) { caller = null; }
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
    ControllerWindow.getInstance = function () {
        if (!this._instance) {
            this._instance = new ControllerWindow(ControllerWindow.getInstance);
        }
        return this._instance;
    };
    ControllerWindow.prototype.init = function () {
        var _this = this;
        // 画像のリクエストイベント
        this.socketAPI.getFromClient("imageRequestFromController", function (data) {
            var twitterID = data["twitterID"];
            _this.oauthAPI.getProfileImageURL(twitterID, function (userName, imageURL) {
                if (imageURL != "") {
                    _this.imageLoadAPI.requestImage(userName, imageURL, function (data) { return _this.imageLoadHandler(userName, data); });
                }
                else {
                }
            });
        });
    };
    ControllerWindow.prototype.imageLoadHandler = function (userName, data) {
        var baloonData = this.imageModifyAPI.createBaloon(userName);
        var spriteSheetData = this.imageModifyAPI.createSpriteSheet(data);
        this.socketAPI.emitToClient("imageGetComplete");
        this.socketAPI.emitToAllClients("imageGetEvent", { "baloonData": baloonData, "imageData": spriteSheetData });
    };
    return ControllerWindow;
})();
exports.ControllerWindow = ControllerWindow;
