var gulp = require("gulp");
var path = require("path");

var ts = require('gulp-typescript');

// ルートフォルダ
var ROOT_FOLDER = "./";

gulp.task('tsc', function () {
    // jsフォルダ以下のtsファイルに変更があり次第、main.tsをコンパイルする。
    gulp.watch(['./js/**/**.ts', './client_modules/**.ts'], function (event) {
        console.log("amdコンパイル");

        var targetFilePath = event.path;
        var folderPath = getFolderPath(targetFilePath);

        gulp.src([targetFilePath])
            .pipe(ts({
                module: "amd"
            }))
            .js     // 定義ファイルをコンパイルしないための設定
            .pipe(gulp.dest(folderPath));
    });

    // jsフォルダ以下のtsファイルに変更があり次第、server.tsをコンパイルする。
    gulp.watch(['./**.ts', './server_modules/**.ts'], function (event) {
        console.log("commonjsコンパイル");

        var targetFilePath = event.path;
        var folderPath = getFolderPath(targetFilePath);

        gulp.src([targetFilePath])
            .pipe(ts({
                module: "commonjs"
            }))
            .js     // 定義ファイルをコンパイルしないための設定
            .pipe(gulp.dest(folderPath));
    });
});

/**
 * ROOTフォルダからの相対パスを取得
 * folderPath: 相対パスを取得したいフォルダのパス
 * */
function getFolderPath(filePath) {
    var fileFolderPath = path.dirname(filePath);
    return fileFolderPath;
}


