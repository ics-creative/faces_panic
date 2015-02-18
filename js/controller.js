define(["require", "exports", "../client_modules/socketModule"], function (require, exports, socketM) {
    var Controller = (function () {
        function Controller() {
            this.pairingWindow = $("#pairingWindow");
            this.controllerWindow = $("#controllerWindow");
            this.loading = $("#loading");
            // APIを初期化
            this.socketIOAPI = socketM.SocketIOAPI.getInstance();
            this.eventSetting();
        }
        Controller.prototype.eventSetting = function () {
            var _this = this;
            // ペアリングボタンをタップしたら、twitterIDを送信
            $("#generateButton").click(function () {
                var twitterID = $("#twitterID").val();
                if (twitterID.indexOf("@") == 0) {
                    twitterID = twitterID.split("@")[1];
                }
                _this.startImageLoad(twitterID);
            });
            $(".thumbList").on("click", "a", function (event) {
                var target = $(event.currentTarget);
                var twitterID = target.attr("href").split("@")[1];
                _this.startImageLoad(twitterID);
                target.addClass("on");
                setTimeout(function () {
                    target.removeClass("on");
                }, 200);
                return false;
            });
            // 画像作成が完了
            this.socketIOAPI.getFromServer("imageGetComplete", function () {
                _this.imageLoadCompleteHandler();
            });
            //// PCとのペアリングに失敗
            //socket.on("failPairingWithPC", () => {
            //});
        };
        /*
         * 画像読み込みの開始
         * */
        Controller.prototype.startImageLoad = function (twitterID) {
            //this.loading.fadeIn("fast");
            this.socketIOAPI.emitToServer("imageRequestFromController", {
                "twitterID": twitterID
            });
        };
        /*
         * 画像生成の完了
         * */
        Controller.prototype.imageLoadCompleteHandler = function () {
            //this.loading.fadeOut();
        };
        Controller.prototype.sendImageData = function () {
            var _this = this;
            var image = new Image();
            image.src = $("#twitterImage").find("img").attr("src");
            image.addEventListener("load", function (event) { return _this.singleFileReadCompleteHandler(image); });
        };
        /** 一つの画像ファイルの読み込みが完了した時の処理 */
        Controller.prototype.singleFileReadCompleteHandler = function (image) {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);
        };
        return Controller;
    })();
    $(function () {
        new Controller();
    });
});
