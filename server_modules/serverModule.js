/// <reference path="../dts/node/node.d.ts" />;
var http = require("http");
// fsモジュールの読み込み
var fs = require("fs");
// pathモジュールの読み込み
var path = require("path");
var ServerAPI = (function () {
    function ServerAPI(caller) {
        if (caller === void 0) { caller = null; }
        if (caller == ServerAPI.getInstance) {
        }
        else {
            throw new Error("直接インスタンス化はできません。");
        }
    }
    ServerAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new ServerAPI(ServerAPI.getInstance);
        }
        return this._instance;
    };
    ServerAPI.prototype.initServer = function (rootFolder) {
        var _this = this;
        this._rootFolder = rootFolder; // ルートフォルダを指定
        var server = http.createServer(function (request, response) { return _this.requestListener(request, response); });
        server.listen((process.env.PORT || 5000), function () { return _this.listenHandler(); });
        return server;
    };
    /**
     * httpサーバーが待ち受け状態になった時に実行される関数
     */
    ServerAPI.prototype.listenHandler = function () {
        console.log((process.env.PORT || 5000) + "でhttpサーバーが待ち受け状態です");
    };
    /**
     * サーバーにリクエストがあった際に実行される関数
     */
    ServerAPI.prototype.requestListener = function (request, response) {
        // リクエストがあったファイル
        var requestURL = request.url;
        if (requestURL.indexOf("server.js") >= 0) {
            response.end("ソースが見れると思った？残念！");
            return;
        }
        // リクエストのあったファイルの拡張子を取得
        var extensionName = path.extname(requestURL);
        var contentType;
        var isBinary;
        // ファイルの拡張子に応じてルーティング処理
        if (extensionName != "") {
            switch (extensionName) {
                case ".html":
                    contentType = "text/html";
                    isBinary = false;
                    break;
                case ".css":
                    contentType = "text/css";
                    isBinary = false;
                    break;
                case ".js":
                case ".ts":
                    contentType = "text/javascript";
                    isBinary = false;
                    break;
                case ".png":
                    contentType = "image/png";
                    isBinary = true;
                    break;
                case ".jpg":
                    contentType = "image/jpeg";
                    isBinary = true;
                    break;
                case ".gif":
                    contentType = "image/gif";
                    isBinary = true;
                    break;
                case ".swf":
                    contentType = "application/x-shockwave-flash";
                    isBinary = true;
                    break;
                default:
                    // どこにも該当しない場合は、index.htmlを読み込む
                    requestURL = "/index.html"; // 絶対パスでの指定を忘れない
                    contentType = "text/html";
                    isBinary = false;
                    break;
            }
        }
        else {
            // 拡張子が存在しない場合は、index.htmlを読み込む
            requestURL = "/index.html"; // 絶対パスでの指定を忘れない
            contentType = "text/html";
            isBinary = false;
        }
        this.readFileHandler(requestURL, contentType, isBinary, response);
    };
    /**
     * ファイルの読み込み処理
     */
    ServerAPI.prototype.readFileHandler = function (fileName, contentType, isBinary, response) {
        var _this = this;
        var filePath = this._rootFolder + fileName; // ファイルの場所
        // filePathが存在するかどうかを調べる。存在している場合はexistにtrueが入る。
        fs.exists(filePath, function (exist) { return _this.responseHandler(exist, filePath, contentType, isBinary, response); });
    };
    /**
     * レスポンスを返す処理
     */
    ServerAPI.prototype.responseHandler = function (exist, filePath, contentType, isBinary, response) {
        var _this = this;
        if (exist) {
            // ファイルを読み込む際のエンコード指定
            var encoding = !isBinary ? "utf8" : "binary";
            // ファイルの読み込み
            fs.readFile(filePath, { encoding: encoding }, function (error, data) { return _this.fileReadhandler(error, data, contentType, isBinary, response); });
        }
        else {
            // ファイルが存在しない場合は400エラーを返す。
            response.statusCode = 400;
            response.end("400 Error");
        }
    };
    /**
     * ファイルの読み込みが完了した時に実行される処理
     */
    ServerAPI.prototype.fileReadhandler = function (error, data, contentType, isBinary, response) {
        if (error) {
            response.statusCode = 500; // レスポンスデータにステータスコード500を設定
            response.end("Internal Server Error");
        }
        else {
            response.statusCode = 200; // レスポンスデータにステータスコード200を設定
            response.setHeader("Content-Type", contentType); // レスポンスデータのヘッダーにContent-Typeを設定
            if (!isBinary) {
                response.end(data);
            }
            else {
                response.end(data, "binary"); // バイナリーデータの場合はend()の第二引数に"binary"を指定
            }
        }
    };
    return ServerAPI;
})();
exports.ServerAPI = ServerAPI;
