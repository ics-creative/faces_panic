/// <reference path="../dts/jquery.d.ts" />
/// <reference path="../dts/socket.io-client/socket.io-client.d.ts" />
define(["require", "exports"], function (require, exports) {
    var SocketIOAPI = (function () {
        function SocketIOAPI(caller) {
            if (caller === void 0) { caller = null; }
            if (caller == SocketIOAPI.getInstance) {
                console.log("location.host:" + location.host);
                this._socket = io.connect(location.host);
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
        SocketIOAPI.prototype.emitToServer = function (eventName, data) {
            if (data === void 0) { data = null; }
            if (this._socket) {
                console.log("emitToServer:" + eventName + " data:" + data.toString());
                this._socket.emit(eventName, data);
            }
            else {
                console.log("_socketがありません");
            }
        };
        SocketIOAPI.prototype.getFromServer = function (eventName, callBack) {
            if (callBack === void 0) { callBack = null; }
            if (this._socket) {
                this._socket.on(eventName, function (data) {
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
});
