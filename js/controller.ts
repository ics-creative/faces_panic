/// <reference path="../dts/jquery.d.ts" />
/// <reference path="../dts/socket.io-client/socket.io-client.d.ts" />
import socketM = require("../client_modules/socketModule");

class Controller {
    private socketIOAPI:socketM.SocketIOAPI;

    private pairingWindow = $("#pairingWindow");
    private controllerWindow = $("#controllerWindow");
    private loading = $("#loading");

    public constructor() {
        // APIを初期化
        this.socketIOAPI = socketM.SocketIOAPI.getInstance();
        this.eventSetting();
    }

    private eventSetting():void {
        // ペアリングボタンをタップしたら、twitterIDを送信
        $("#generateButton").click(() => {

            var twitterID:string = $("#twitterID").val();
            if (twitterID.indexOf("@") == 0) {
                twitterID = twitterID.split("@")[1];
            }
            this.startImageLoad(twitterID);
        });

        $(".thumbList").on("click", "a", (event:JQueryEventObject) => {
            var target = $(event.currentTarget);
            var twitterID:string = target.attr("href").split("@")[1];
            this.startImageLoad(twitterID);
            target.addClass("on");
            setTimeout(() => {
                target.removeClass("on");
            }, 200);
            return false;
        });

        // 画像作成が完了
        this.socketIOAPI.getFromServer("imageGetComplete", () => {
            this.imageLoadCompleteHandler();
        });

        //// PCとのペアリングに失敗
        //socket.on("failPairingWithPC", () => {
        //});

    }

    /*
     * 画像読み込みの開始
     * */
    private startImageLoad(twitterID:string) {
        //this.loading.fadeIn("fast");

        this.socketIOAPI.emitToServer("imageRequestFromController", {
            "twitterID": twitterID
        });
    }

    /*
     * 画像生成の完了
     * */
    private imageLoadCompleteHandler():void {
        //this.loading.fadeOut();
    }

    
    private sendImageData():void {
        var image:HTMLImageElement = <HTMLImageElement> new Image();
        image.src = <string> $("#twitterImage").find("img").attr("src");
        image.addEventListener("load", (event:Event) => this.singleFileReadCompleteHandler(image));
    }


    /** 一つの画像ファイルの読み込みが完了した時の処理 */
    private singleFileReadCompleteHandler(image:HTMLImageElement):void {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
    }
}


$(function () {
    new Controller();
});



