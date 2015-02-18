/// <reference path="../dts/node/node.d.ts" />;
/// <reference path="../dts/createjs/createjs.d.ts" />;
/// <reference path="../dts/imagemagick/imagemagick.d.ts" />
var fs = require("fs");
var imageMagick = require("imagemagick");
var Canvas = require("canvas");
require("node-easel");
var Image = Canvas.Image;
var runningManDataM = require("./runningManDataModule");
var paramM = require("./paramModule");
var ImageModifyAPI = (function () {
    function ImageModifyAPI(caller) {
        if (caller === void 0) { caller = null; }
        this.SHEET_WIDTH = 1024;
        this.GRANT_COUNT = 64;
        this.ICON_WIDTH = 50;
        this.FACE_MARGIN_LEFT = 26;
        this.TMP_FOLDER = "./tmp/";
        this.baloonFontFamily = "serif";
        this.BALOON_WIDTH = 200;
        this.BALOON_HEIGHT = 50;
        this._frame = { width: 82, height: 148 };
        if (caller == ImageModifyAPI.getInstance) {
            this.initCanvas();
            this._runningManAPI = runningManDataM.RunningManAPI.getInstance();
        }
        else {
            throw new Error("直接インスタンス化はできません。");
        }
    }
    ImageModifyAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new ImageModifyAPI(ImageModifyAPI.getInstance);
        }
        return this._instance;
    };
    /*
    * スプライトシート用のCanavsとフキダシ画像用のCanvasを初期化
    * */
    ImageModifyAPI.prototype.initCanvas = function () {
        this._canvas = new Canvas(this.SHEET_WIDTH, this.SHEET_WIDTH);
        this._stage = new createjs.Stage(this._canvas);
        this._container = new createjs.Container();
        this._stage.addChild(this._container);
        this._baloonCanvas = new Canvas(this.BALOON_WIDTH, this.BALOON_HEIGHT);
        this.baloonFontFamily = "serif";
        console.log("baloon Font is " + this.baloonFontFamily);
        this._baloonStage = new createjs.Stage(this._baloonCanvas);
        this._baloon = new createjs.Container();
        this._baloonStage.addChild(this._baloon);
    };
    /*
    * スプライトシートを作る
    * */
    ImageModifyAPI.prototype.createSpriteSheet = function (imgSrc) {
        var iconImage = this.createIconImage(imgSrc);
        var iconBG = this.createIconBG();
        var runningManShapes = this._runningManAPI.getShapesData();
        this.tileIcon(iconImage, iconBG, runningManShapes);
        return this._canvas.toDataURL();
    };
    /*
    * アイコン画像をBitmao化
    * */
    ImageModifyAPI.prototype.createIconImage = function (imgSrc) {
        var iconImage = this.createBitmap(imgSrc);
        return iconImage;
    };
    /*
    * Base64の画像からBitmapを作成
    * */
    ImageModifyAPI.prototype.createBitmap = function (imgSrc) {
        var image = new Canvas.Image();
        image.src = imgSrc;
        var bitmap = new createjs.Bitmap(image);
        var sacale = this.ICON_WIDTH / image.width;
        bitmap.scaleX = bitmap.scaleY = sacale;
        return bitmap;
    };
    /*
    * アイコンの背景を作る
    * */
    ImageModifyAPI.prototype.createIconBG = function () {
        var bg = new createjs.Shape();
        bg.graphics.beginStroke("#333").setStrokeStyle(1).beginFill("#ffffff").drawRect(0, 0, this.ICON_WIDTH, this.ICON_WIDTH).endStroke().endFill();
        return bg;
    };
    /*
    * アイコンを並べる
    * */
    ImageModifyAPI.prototype.tileIcon = function (iconImage, iconBG, runningManShapes) {
        var positionX = 0;
        var positionY = 0;
        var jumpData = runningManDataM.RunningManAPI.jumpData;
        for (var i = 0; i < this.GRANT_COUNT; i++) {
            var bodyShape = runningManShapes[i];
            bodyShape.x += positionX;
            bodyShape.y += positionY;
            this._container.addChild(bodyShape);
            var iconImage = iconImage.clone();
            var iconBG = iconBG.clone();
            iconImage.x = iconBG.x = positionX + this.FACE_MARGIN_LEFT;
            iconImage.y = iconBG.y = positionY + jumpData[i] / 2;
            this._container.addChild(iconBG);
            this._container.addChild(iconImage);
            positionX += this._frame["width"];
            if (positionX > this.SHEET_WIDTH - this._frame["width"]) {
                positionX = 0;
                positionY += this._frame["height"];
            }
        }
        this._stage.update();
    };
    /*
    * JPG等のPNG以外の画像をpngに変換する。PNG以外はnode-canvasで扱えないため。
    * */
    ImageModifyAPI.prototype.convertToPng = function (type, buffer, callBack, errorHandler) {
        var _this = this;
        var date = new Date().getTime();
        var tempFileName = "temp-" + Math.floor(date + 10000 * Math.random());
        var convertedFileName = tempFileName + "_converted.png";
        fs.writeFileSync(this.TMP_FOLDER + tempFileName, buffer, 'binary');
        var conv = imageMagick.convert([this.TMP_FOLDER + tempFileName, this.TMP_FOLDER + convertedFileName], function (err, stdout) {
            if (err) {
                errorHandler();
            }
            else {
                var file = fs.readFile(_this.TMP_FOLDER + convertedFileName, function (err, data) {
                    if (err) {
                        errorHandler();
                    }
                    var base64Data = new Buffer(data).toString('base64');
                    callBack(base64Data);
                    try {
                        fs.unlinkSync(_this.TMP_FOLDER + tempFileName);
                        fs.unlinkSync(_this.TMP_FOLDER + convertedFileName);
                    }
                    catch (e) {
                        console.log("error");
                    }
                });
            }
        });
    };
    /*
     * 吹き出し画像を作る
     * */
    ImageModifyAPI.prototype.createBaloon = function (userName) {
        this._baloon.removeAllChildren();
        this.createBaloonBG();
        this.createText(userName);
        this._baloonStage.update();
        return this._baloonCanvas.toDataURL();
    };
    /*
    * 吹き出し画像の背景を作る
    * */
    ImageModifyAPI.prototype.createBaloonBG = function () {
        var ranomColorIndex = Math.floor(Math.random() * paramM.Param.BODY_COLORS.length);
        var color = paramM.Param.BODY_COLORS[ranomColorIndex];
        if (color == "#333333")
            color = paramM.Param.BODY_COLORS[2];
        var w = this.BALOON_WIDTH;
        var h = 40;
        var shape = new createjs.Shape();
        shape.graphics.beginFill(color).setStrokeStyle(1).drawRoundRect(0, 0, w, h, 10).endFill();
        var triangle = new createjs.Shape();
        triangle.graphics.beginFill(color).setStrokeStyle(1).moveTo(w / 2 - 10, h - 1).lineTo(w / 2, h + 10).lineTo(w / 2 + 10, h - 1).endFill();
        this._baloon.addChild(shape);
        this._baloon.addChild(triangle);
    };
    /*
    * Textクラスを作って吹き出しに配置する。
    * */
    ImageModifyAPI.prototype.createText = function (userName) {
        var userNameText = new createjs.Text();
        userNameText.color = "#333333";
        userNameText.font = "22px " + this.baloonFontFamily;
        userNameText.text = userName;
        var textWidth = userNameText.getMeasuredWidth();
        var textHeight = userNameText.getMeasuredHeight();
        userNameText.x = (this.BALOON_WIDTH / 2) - (textWidth / 2);
        userNameText.y = (this.BALOON_HEIGHT / 2) - (textHeight / 2) - 6;
        this._baloon.addChild(userNameText);
    };
    return ImageModifyAPI;
})();
exports.ImageModifyAPI = ImageModifyAPI;
