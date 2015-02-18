/// <reference path="../dts/jquery.d.ts" />
/// <reference path="../dts/socket.io-client/socket.io-client.d.ts" />

export class SocketIOAPI {
    private _socket:SocketIOClient.Socket;

    private static _instance:SocketIOAPI;

    public static getInstance():SocketIOAPI {
        if (!this._instance) {
            this._instance = new SocketIOAPI(SocketIOAPI.getInstance);
        }
        return this._instance;
    }

    constructor(caller:Function = null) {
        if (caller == SocketIOAPI.getInstance) {
            console.log("location.host:" + location.host);
            this._socket = io.connect(location.host);
        }
        else {
            throw new Error("直接インスタンス化はできません。");
        }
    }

    public emitToServer(eventName:string, data:Object = null):void {
        if (this._socket) {
            console.log("emitToServer:" + eventName + " data:" + data.toString());
            this._socket.emit(eventName, data);
        }
        else {
            console.log("_socketがありません");
        }
    }

    public getFromServer(eventName:string, callBack:Function = null):void
    {
        if (this._socket) {
            this._socket.on(eventName, (data) => {
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

