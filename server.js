var serverM = require("./server_modules/serverModule");
var socketM = require("./server_modules/socketModule");
var Main = (function () {
    function Main() {
        // APIを初期化
        this.serverAPI = serverM.ServerAPI.getInstance();
        this.socketIOAPI = socketM.SocketIOAPI.getInstance();
        // サーバーを初期化
        var server = this.serverAPI.initServer(__dirname);
        // Sokcet.IOを有効化
        this.socketIOAPI.init(server);
    }
    return Main;
})();
new Main();
