/// <reference path="dts/node/node.d.ts" />
/// <reference path="dts/createjs/createjs.d.ts" />
import http = require("http");
import serverM = require("./server_modules/serverModule");
import socketM = require("./server_modules/socketModule");

class Main
{
    private serverAPI:serverM.ServerAPI;
    private socketIOAPI:socketM.SocketIOAPI;

    constructor()
    {
        // APIを初期化
        this.serverAPI = serverM.ServerAPI.getInstance();
        this.socketIOAPI = socketM.SocketIOAPI.getInstance();

        // サーバーを初期化
        var server:http.Server = this.serverAPI.initServer(__dirname);
        // Sokcet.IOを有効化
        this.socketIOAPI.init(server);
    }
}

new Main();

