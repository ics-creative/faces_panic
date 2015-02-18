/*
 * node-easelを使った図形表示テストです
 *
 * */
var http = require("http");
var fs = require("fs");
var Canvas = require("canvas");
require("node-easel");

var server = http.createServer(function (req, res) {
    res.setHeader("Content-Type", "text/html");
    var canvas = new Canvas(400, 400); 
    var stage = new createjs.Stage(canvas);
    var shape = new createjs.Shape();
         shape.graphics.beginFill("#FF3DB1") .
        drawPolyStar(200, 200, 100, 5, 0.6);
    stage.addChild(shape);
    stage.update();

    res.end('<img src="' + canvas.toDataURL() + '">'); 
}).listen(5000);
