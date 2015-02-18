/// <reference path="../dts/node/node.d.ts" />;
/// <reference path="../dts/createjs/createjs.d.ts" />;
/// <reference path="../dts/imagemagick/imagemagick.d.ts" />

import fs = require("fs");
import imageMagick = require("imagemagick");
var Canvas = require("canvas");
require("node-easel");
var Image = Canvas.Image;
import runningManDataM = require("./runningManDataModule");
import paramM = require("./paramModule");

export class ImageModifyAPI {
    private static _instance:ImageModifyAPI;

    private _runningManAPI:runningManDataM.RunningManAPI;
    private SHEET_WIDTH:number = 1024;
    private GRANT_COUNT:number = 64;
    private ICON_WIDTH:number = 50;
    private FACE_MARGIN_LEFT:number = 26;
    private TMP_FOLDER:string = "./tmp/";

    private baloonFontFamily:string = "serif";

    private _canvas;
    private _stage:createjs.Stage;
    private _container:createjs.Container;
    private _baloonCanvas;
    private _baloonStage:createjs.Stage;
    private _baloon:createjs.Container;
    private BALOON_WIDTH:number = 200;
    private BALOON_HEIGHT:number = 50;


    private _frame:Object = {width: 82, height: 148};

    public static getInstance():ImageModifyAPI {
        if (!this._instance) {
            this._instance = new ImageModifyAPI(ImageModifyAPI.getInstance);
        }
        return this._instance;
    }

    constructor(caller:Function = null) {
        if (caller == ImageModifyAPI.getInstance) {
            this.initCanvas();
            this._runningManAPI = runningManDataM.RunningManAPI.getInstance();
        }
        else {
            throw new Error("直接インスタンス化はできません。");
        }
    }

    /*
    * スプライトシート用のCanavsとフキダシ画像用のCanvasを初期化
    * */
    public initCanvas():void {
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
    }

    /*
    * スプライトシートを作る
    * */
    public createSpriteSheet(imgSrc:string):string {
        var iconImage:createjs.Bitmap = this.createIconImage(imgSrc);
        var iconBG:createjs.Shape = this.createIconBG();
        var runningManShapes:createjs.Shape[] = this._runningManAPI.getShapesData();
        this.tileIcon(iconImage, iconBG, runningManShapes);
        return this._canvas.toDataURL();
    }

    /*
    * アイコン画像をBitmao化
    * */
    private createIconImage(imgSrc:string):createjs.Bitmap {
        var iconImage:createjs.Bitmap = this.createBitmap(imgSrc);
        return iconImage;
    }

    /*
    * Base64の画像からBitmapを作成
    * */
    private createBitmap(imgSrc:string):createjs.Bitmap {
        var image = new Canvas.Image();
        image.src = imgSrc;
        var bitmap:createjs.Bitmap = new createjs.Bitmap(image);
        var sacale:number = this.ICON_WIDTH / image.width;
        bitmap.scaleX = bitmap.scaleY = sacale;
        return bitmap;
    }

    /*
    * アイコンの背景を作る
    * */
    private createIconBG():createjs.Shape {
        var bg:createjs.Shape = new createjs.Shape();
        bg.graphics
            .beginStroke("#333")
            .setStrokeStyle(1)
            .beginFill("#ffffff")
            .drawRect(0, 0, this.ICON_WIDTH, this.ICON_WIDTH)
            .endStroke()
            .endFill();
        return bg;
    }

    /*
    * アイコンを並べる
    * */
    private tileIcon(iconImage:createjs.Bitmap, iconBG:createjs.Shape, runningManShapes:createjs.Shape[]):void {
        var positionX:number = 0;
        var positionY:number = 0;
        var jumpData:number[] = runningManDataM.RunningManAPI.jumpData;

        for (var i:number = 0; i < this.GRANT_COUNT; i++) {
            var bodyShape:createjs.Shape = runningManShapes[i];
            bodyShape.x += positionX;
            bodyShape.y += positionY;
            this._container.addChild(bodyShape);

            var iconImage:createjs.Bitmap = iconImage.clone();
            var iconBG:createjs.Shape = iconBG.clone();
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
    }

    /*
    * JPG等のPNG以外の画像をpngに変換する。PNG以外はnode-canvasで扱えないため。
    * */
    public convertToPng(type:string, buffer:Buffer, callBack:Function, errorHandler:Function):void {
        var date:number = new Date().getTime();
        var tempFileName:string = "temp-" + Math.floor(date + 10000 * Math.random());
        var convertedFileName:string = tempFileName + "_converted.png";
        fs.writeFileSync(this.TMP_FOLDER + tempFileName, buffer, 'binary');
        var conv = imageMagick.convert([this.TMP_FOLDER + tempFileName, this.TMP_FOLDER + convertedFileName],
            (err, stdout) => {
                if (err) {
                    errorHandler();
                }
                else {
                    var file = fs.readFile(this.TMP_FOLDER + convertedFileName, (err, data) => {
                        if (err) {
                            errorHandler();
                        }
                        var base64Data:string = new Buffer(data).toString('base64');
                        callBack(base64Data);

                        try {
                            fs.unlinkSync(this.TMP_FOLDER + tempFileName);
                            fs.unlinkSync(this.TMP_FOLDER + convertedFileName);
                        }
                        catch (e) {
                            console.log("error");
                        }
                    });
                }
            });
    }

    /*
     * 吹き出し画像を作る
     * */
    public createBaloon(userName:string):string {
        this._baloon.removeAllChildren();
        this.createBaloonBG();
        this.createText(userName);
        this._baloonStage.update();
        return this._baloonCanvas.toDataURL();
    }

    /*
    * 吹き出し画像の背景を作る
    * */
    private createBaloonBG():void {
        var ranomColorIndex:number = Math.floor(Math.random() * paramM.Param.BODY_COLORS.length);
        var color:string = paramM.Param.BODY_COLORS[ranomColorIndex];
        if (color == "#333333")
            color = paramM.Param.BODY_COLORS[2];

        var w:number = this.BALOON_WIDTH;
        var h:number = 40;
        var shape = new createjs.Shape();
        shape.graphics
            .beginFill(color)
            .setStrokeStyle(1)
            .drawRoundRect(0, 0, w, h, 10)
            .endFill();

        var triangle = new createjs.Shape();
        triangle.graphics
            .beginFill(color)
            .setStrokeStyle(1)
            .moveTo(w / 2 - 10, h - 1)
            .lineTo(w / 2, h + 10)
            .lineTo(w / 2 + 10, h - 1)
            .endFill();

        this._baloon.addChild(shape);
        this._baloon.addChild(triangle);

    }

    /*
    * Textクラスを作って吹き出しに配置する。
    * */
    private createText(userName:string):void {
        var userNameText:createjs.Text = new createjs.Text();
        userNameText.color = "#333333";
        userNameText.font = "22px " + this.baloonFontFamily;
        userNameText.text = userName;
        var textWidth = userNameText.getMeasuredWidth();
        var textHeight = userNameText.getMeasuredHeight();
        userNameText.x = (this.BALOON_WIDTH / 2) - (textWidth / 2);
        userNameText.y = (this.BALOON_HEIGHT / 2) - (textHeight / 2) - 6;
        this._baloon.addChild(userNameText);
    }
}
