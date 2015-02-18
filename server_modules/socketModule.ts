/// <reference path="../dts/node/node.d.ts" />
/// <reference path="../dts/socket.io/socket.io.d.ts" />
import http = require("http");
import socketIO = require("socket.io");
import controllerM = require("./controllerWindow");

export class SocketIOAPI {
    private static _instance:SocketIOAPI;

    public static getInstance():SocketIOAPI {
        if (!this._instance) {
            this._instance = new SocketIOAPI(SocketIOAPI.getInstance);
        }
        return this._instance;
    }

    private _io;
    private _socket;
    private controllerWndow:controllerM.ControllerWindow;

    constructor(caller:Function = null) {
        if (caller == SocketIOAPI.getInstance) {
        }
        else {
            throw new Error("直接インスタンス化はできません。");
        }
    }

    public init(server:http.Server):void {
        this._io = socketIO(server);

        // サーバーへのアクセスを監視。クライアントからのアクセスがあったらコールバックが実行
        this._io.sockets.on("connection", (socket) => {
            this.connectedHandler(socket);
        });

        // 接続エラー
        this._io.sockets.on("connect_error", function (socket) {
            console.log("connect_error");
        });
        // 接続終了
        this._io.sockets.on("disconnect", function (socket) {
            socket.emit("disconnectEvent");
            console.log("disconnecth");
        });
    }

    private connectedHandler(socket):void {
        this._socket = socket;

        // コントローラーウインドウ用のサーバー処理を初期化
        this.controllerWndow = controllerM.ControllerWindow.getInstance();
        this.controllerWndow.init();
    }

    /*
    * ハンドシェイクを行ったクライアントだけにデータを送信
    * */
    public emitToClient(eventName:string, data:Object = null):void {
        if (this._socket) {
            this._socket.emit(eventName, data);
        }
        else {
            console.log("_socketがありません");
        }
    }

    /*
     * ハンドシェイクを行ったクライアント以外にデータを送信
     * */
    public broadCastToClients(eventName:string, data:Object = null):void {
        if (this._socket) {
            this._socket.broadcast.emit(eventName, data);
        }
        else {
            console.log("_socketがありません");
        }
    }

    /*
     * 全てのクライアントにデータを送信
     * */
    public emitToAllClients(eventName:string, data:Object = null):void {
        if (this._io) {
            this._io.sockets.emit(eventName, data);
        }
        else {
            console.log("_ioがありません");
        }
    }

    public getFromClient(eventName:string, callBack:Function = null):void
    {
        if (this._socket) {
            this._socket.on(eventName, (data) => {
                console.log("getFromClient:" + eventName + " data:" + data.toString());
                if(callBack)
                {
                    callBack(data);
                }
            });
        }
        else {
            console.log("_socketがありません");
        }
    }
}
