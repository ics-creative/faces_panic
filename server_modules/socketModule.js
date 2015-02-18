var socketIO = require("socket.io");
var controllerM = require("./controllerWindow");
var SocketIOAPI = (function () {
    function SocketIOAPI(caller) {
        if (caller === void 0) { caller = null; }
        if (caller == SocketIOAPI.getInstance) {
        }
        else {
            throw new Error("直接インスタンス化はできません。");
        }
    }
    SocketIOAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new SocketIOAPI(SocketIOAPI.getInstance);
        }
        return this._instance;
    };
    SocketIOAPI.prototype.init = function (server) {
        var _this = this;
        this._io = socketIO(server);
        // サーバーへのアクセスを監視。クライアントからのアクセスがあったらコールバックが実行
        this._io.sockets.on("connection", function (socket) {
            _this.connectedHandler(socket);
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
    };
    SocketIOAPI.prototype.connectedHandler = function (socket) {
        this._socket = socket;
        // コントローラーウインドウ用のサーバー処理を初期化
        this.controllerWndow = controllerM.ControllerWindow.getInstance();
        this.controllerWndow.init();
    };
    /*
    * ハンドシェイクを行ったクライアントだけにデータを送信
    * */
    SocketIOAPI.prototype.emitToClient = function (eventName, data) {
        if (data === void 0) { data = null; }
        if (this._socket) {
            this._socket.emit(eventName, data);
        }
        else {
            console.log("_socketがありません");
        }
    };
    /*
     * ハンドシェイクを行ったクライアント以外にデータを送信
     * */
    SocketIOAPI.prototype.broadCastToClients = function (eventName, data) {
        if (data === void 0) { data = null; }
        if (this._socket) {
            this._socket.broadcast.emit(eventName, data);
        }
        else {
            console.log("_socketがありません");
        }
    };
    /*
     * 全てのクライアントにデータを送信
     * */
    SocketIOAPI.prototype.emitToAllClients = function (eventName, data) {
        if (data === void 0) { data = null; }
        if (this._io) {
            this._io.sockets.emit(eventName, data);
        }
        else {
            console.log("_ioがありません");
        }
    };
    SocketIOAPI.prototype.getFromClient = function (eventName, callBack) {
        if (callBack === void 0) { callBack = null; }
        if (this._socket) {
            this._socket.on(eventName, function (data) {
                console.log("getFromClient:" + eventName + " data:" + data.toString());
                if (callBack) {
                    callBack(data);
                }
            });
        }
        else {
            console.log("_socketがありません");
        }
    };
    return SocketIOAPI;
})();
exports.SocketIOAPI = SocketIOAPI;
