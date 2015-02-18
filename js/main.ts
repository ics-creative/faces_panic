/// <reference path="../dts/jquery.d.ts" />
/// <reference path="../dts/socket.io-client/socket.io-client.d.ts" />
/// <reference path="../dts/createjs/createjs.d.ts" />
// Socket.IOを使って接続
import socketM = require("../client_modules/socketModule");
import boyM = require("../client_modules/boyModule");
class JsMain {
    private socketIOAPI:socketM.SocketIOAPI;
    private _canvas:HTMLCanvasElement;
    private _stage:createjs.Stage;
    private windowWidth:number;
    private windowHeight:number;
    private CANVAS_WIDTH:number = 1980;
    private CANVAS_HEIGHT:number = 1024;


    // アニメーション中のパーティクルを格納する配列
    private _animationParticles:boyM.Boy[] = [];
    // パーティクルのオブジェクトプール。アニメーションがされていないパーティクルがここに待機している。
    private _particlePool:boyM.Boy[] = [];

    public constructor() {
        // APIを初期化
        this.socketIOAPI = socketM.SocketIOAPI.getInstance();

        this._canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
        this._stage = new createjs.Stage(this._canvas);

        this.eventSetting();
    }

    private eventSetting():void {
        this.socketIOAPI.getFromServer("imageGetEvent", (data) => {
            this.addBoy(data["baloonData"], data["imageData"]);
        });

        createjs.Ticker.timingMode = createjs.Ticker.RAF;
        createjs.Ticker.addEventListener("tick", (event) => this.tickHandler(event));

        // リサイズイベント
        //this.resizeHandler();
        //window.addEventListener("resize", () => this.resizeHandler());
    }

    private addBoy(baloonData:string, imageData:string):void
    {
        var boy:boyM.Boy = new boyM.Boy(baloonData, imageData);
        boy.y = this.CANVAS_HEIGHT / 2 + Math.random() * 200;
        this._stage.addChild(boy);
        this._animationParticles.push(boy);
    }

    /*
     *　パーティクルのアニメーション
     * */
    private updateParticles():void {
        if(this._animationParticles.length <= 0)
            return;

        for (var i:number = 0; i < this._animationParticles.length; i++) {
            var boy = this._animationParticles[i];
            if(boy.x >= this.CANVAS_WIDTH - boy.spriteWidth / 2)
                boy.turn();

            if(boy.x < 0)
                boy.turn();

            if(boy.y < 0)
                boy.vTurn();

            if(boy.y >= this.CANVAS_HEIGHT)
                boy.vTurn();


//            boy.isDead = boy.x > this.windowWidth;
            if (!boy.isDead) {
                boy.update();
            }
            else {
                // particleを取り除く
                this.removeParticle(boy, i);
            }

        }
    }

    /*
     * パーティクルを取り除く。
     * */
    private removeParticle(particle:boyM.Boy, animationIndex:number):void {
        // Containerからパーティクルをremove
        this._stage.removeChild(particle);
        // アニメーションのパーティクルから取り除く。
        this._animationParticles.splice(animationIndex, 1);
        if (this._particlePool.indexOf(particle) == -1) {
            // プールにパーティクルが無いことを確認して格納
            this._particlePool.push(particle);
        }
    }

    private tickHandler(event):void {
        this.updateParticles();
        this._stage.update();
    }

    /*
     * リサイズのイベント処理
     * */
    private resizeHandler():void {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        // ステージのサイズをwindowのサイズに変更
        this._stage.canvas.width = this.windowWidth;
        this._stage.canvas.height = this.windowWidth;
    }
}

$(function () {
    new JsMain();
});





