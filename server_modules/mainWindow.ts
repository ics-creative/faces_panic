/// <reference path="../dts/node/node.d.ts" />
import socketM = require("./socketModule");

export class MainWindow {
    private static _instance:MainWindow;

    public static getInstance():MainWindow {
        if (!this._instance) {
            this._instance = new MainWindow(MainWindow.getInstance);
        }
        return this._instance;
    }

    private socketAPI:socketM.SocketIOAPI;

    constructor(caller:Function = null) {
        if (caller == MainWindow.getInstance) {
            this.socketAPI = socketM.SocketIOAPI.getInstance();
        }
        else {
            throw new Error("直接インスタンス化はできません。");
        }
    }

    public init():void
    {
    }
}
