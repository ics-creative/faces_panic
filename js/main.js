define(["require", "exports", "../client_modules/socketModule", "../client_modules/boyModule"], function (require, exports, socketM, boyM) {
    var JsMain = (function () {
        function JsMain() {
            this.CANVAS_WIDTH = 1980;
            this.CANVAS_HEIGHT = 1024;
            // アニメーション中のパーティクルを格納する配列
            this._animationParticles = [];
            // パーティクルのオブジェクトプール。アニメーションがされていないパーティクルがここに待機している。
            this._particlePool = [];
            // APIを初期化
            this.socketIOAPI = socketM.SocketIOAPI.getInstance();
            this._canvas = document.getElementById("myCanvas");
            this._stage = new createjs.Stage(this._canvas);
            this.eventSetting();
        }
        JsMain.prototype.eventSetting = function () {
            var _this = this;
            this.socketIOAPI.getFromServer("imageGetEvent", function (data) {
                _this.addBoy(data["baloonData"], data["imageData"]);
            });
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", function (event) { return _this.tickHandler(event); });
            // リサイズイベント
            //this.resizeHandler();
            //window.addEventListener("resize", () => this.resizeHandler());
        };
        JsMain.prototype.addBoy = function (baloonData, imageData) {
            var boy = new boyM.Boy(baloonData, imageData);
            boy.y = this.CANVAS_HEIGHT / 2 + Math.random() * 200;
            this._stage.addChild(boy);
            this._animationParticles.push(boy);
        };
        /*
         *　パーティクルのアニメーション
         * */
        JsMain.prototype.updateParticles = function () {
            if (this._animationParticles.length <= 0)
                return;
            for (var i = 0; i < this._animationParticles.length; i++) {
                var boy = this._animationParticles[i];
                if (boy.x >= this.CANVAS_WIDTH - boy.spriteWidth / 2)
                    boy.turn();
                if (boy.x < 0)
                    boy.turn();
                if (boy.y < 0)
                    boy.vTurn();
                if (boy.y >= this.CANVAS_HEIGHT)
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
        };
        /*
         * パーティクルを取り除く。
         * */
        JsMain.prototype.removeParticle = function (particle, animationIndex) {
            // Containerからパーティクルをremove
            this._stage.removeChild(particle);
            // アニメーションのパーティクルから取り除く。
            this._animationParticles.splice(animationIndex, 1);
            if (this._particlePool.indexOf(particle) == -1) {
                // プールにパーティクルが無いことを確認して格納
                this._particlePool.push(particle);
            }
        };
        JsMain.prototype.tickHandler = function (event) {
            this.updateParticles();
            this._stage.update();
        };
        /*
         * リサイズのイベント処理
         * */
        JsMain.prototype.resizeHandler = function () {
            this.windowWidth = window.innerWidth;
            this.windowHeight = window.innerHeight;
            // ステージのサイズをwindowのサイズに変更
            this._stage.canvas.width = this.windowWidth;
            this._stage.canvas.height = this.windowWidth;
        };
        return JsMain;
    })();
    $(function () {
        new JsMain();
    });
});
