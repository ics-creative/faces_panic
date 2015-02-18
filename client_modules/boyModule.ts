/// <reference path="../dts/createjs/createjs.d.ts" />
export class Boy extends createjs.Container {

    private _baloon:createjs.Sprite;
    private _sprite:createjs.Sprite;
    private _vx:number;
    private _vy:number;
    private _scale:number;
    public isDead:boolean = false;
    public spriteWidth:number = 82;
    public spriteHeight:number = 148;

    constructor(baloonData:string, imageData:string) {
        super();
        this.setBounds(0,0,200,148);
        this._sprite = this.createSprite(imageData);
        this._sprite.play();

        var s:createjs.Shape = new createjs.Shape();

        //s.graphics.beginStroke("#f00").drawRect(0,0,200,149);
        //this.addChild(s);

        this.addChild(this._sprite);
        var baloon:createjs.Bitmap = this.createBaloon(baloonData);
        this.addChild(baloon);
        //this.regX = this.spriteWidth / 2;
        //this.regY = this.spriteHeight / 2;
        this.reset();
    }

    private createSprite(imageData:string):createjs.Sprite
    {
        var data:Object = {
            images: [imageData],
            frames: {width: this.spriteWidth, height: this.spriteHeight, count: 64},
            animations: {
                stand: 0,
                run: [1, 2],
                jump: [3, 4, "run"]
            }
        };
        var spriteSheet:createjs.SpriteSheet = new createjs.SpriteSheet(data);
        var sprite:createjs.Sprite = new createjs.Sprite(spriteSheet);
        sprite.setBounds(0,0,this.spriteWidth,this.spriteHeight);
        sprite.regX = this.spriteWidth / 2;
        sprite.regY = this.spriteHeight / 2;
        sprite.x = 92;
        sprite.y = 20;
        return sprite;
    }

    private createBaloon(baloonData:string):createjs.Bitmap
    {
        var image:HTMLImageElement = new Image();
        image.src = baloonData;
        var baloon:createjs.Bitmap = new createjs.Bitmap(image);
        //baloon.regX = image.width / 2;
        //baloon.regY = image.height / 2;
        baloon.y = - 100;
        return baloon;

    }

    public reset():void {
        this._vx = 1 + Math.random() * 6;
        this._vy = (Math.random() - 0.5) * 3;
        this._scale = 0.7 + Math.random() * 0.3;
        this.x = 0;
        this.scaleX = this.scaleY = this._scale;
    }

    public turn():void
    {
        this._sprite.scaleX *= -1;
        this._vx*= -1;
    }

    public vTurn():void
    {
        this._vy*= -1;
    }


    public update() {
        this.x += this._vx;
        this.y += this._vy;
    }
}
