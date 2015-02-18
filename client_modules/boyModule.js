var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function (require, exports) {
    /// <reference path="../dts/createjs/createjs.d.ts" />
    var Boy = (function (_super) {
        __extends(Boy, _super);
        function Boy(baloonData, imageData) {
            _super.call(this);
            this.isDead = false;
            this.spriteWidth = 82;
            this.spriteHeight = 148;
            this.setBounds(0, 0, 200, 148);
            this._sprite = this.createSprite(imageData);
            this._sprite.play();
            var s = new createjs.Shape();
            //s.graphics.beginStroke("#f00").drawRect(0,0,200,149);
            //this.addChild(s);
            this.addChild(this._sprite);
            var baloon = this.createBaloon(baloonData);
            this.addChild(baloon);
            //this.regX = this.spriteWidth / 2;
            //this.regY = this.spriteHeight / 2;
            this.reset();
        }
        Boy.prototype.createSprite = function (imageData) {
            var data = {
                images: [imageData],
                frames: { width: this.spriteWidth, height: this.spriteHeight, count: 64 },
                animations: {
                    stand: 0,
                    run: [1, 2],
                    jump: [3, 4, "run"]
                }
            };
            var spriteSheet = new createjs.SpriteSheet(data);
            var sprite = new createjs.Sprite(spriteSheet);
            sprite.setBounds(0, 0, this.spriteWidth, this.spriteHeight);
            sprite.regX = this.spriteWidth / 2;
            sprite.regY = this.spriteHeight / 2;
            sprite.x = 92;
            sprite.y = 20;
            return sprite;
        };
        Boy.prototype.createBaloon = function (baloonData) {
            var image = new Image();
            image.src = baloonData;
            var baloon = new createjs.Bitmap(image);
            //baloon.regX = image.width / 2;
            //baloon.regY = image.height / 2;
            baloon.y = -100;
            return baloon;
        };
        Boy.prototype.reset = function () {
            this._vx = 1 + Math.random() * 6;
            this._vy = (Math.random() - 0.5) * 3;
            this._scale = 0.7 + Math.random() * 0.3;
            this.x = 0;
            this.scaleX = this.scaleY = this._scale;
        };
        Boy.prototype.turn = function () {
            this._sprite.scaleX *= -1;
            this._vx *= -1;
        };
        Boy.prototype.vTurn = function () {
            this._vy *= -1;
        };
        Boy.prototype.update = function () {
            this.x += this._vx;
            this.y += this._vy;
        };
        return Boy;
    })(createjs.Container);
    exports.Boy = Boy;
});
