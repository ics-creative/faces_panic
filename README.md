# CreateJSとNode.jsを使ってサーバーサイドでCanvasを扱おう

ブログ記事「CreateJSとNode.jsを使ってサーバーサイドでCanvasを扱おう」のデモのソースコードです。

#### デモ動画
Youtubeにアップしてあります。 https://www.youtube.com/watch?v=SGNCwXQ3myM


#### node-canvasとnode-easelをインストール
デモの実行には、node-canvasとnode-easelが必要です。[node-canvas]のインストールにあたっては、いくつか依存ライブラリのインストールが必要です。  詳しいインストール方法は、公式のWikiやQiita等の解説記事を参照してください。筆者の環境（OS X）ですと、xquartzやcairo等をインストールした後、
[node-canvas]:https://github.com/Automattic/node-canvas
[Wiki]:https://github.com/Automattic/node-canvas/wiki
[Qiita]:http://qiita.com/maru_cc/items/ea483477d7ed7df6a9cc

```sh
PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/opt/X11/lib/pkgconfig npm install canvas
```
と実行してインストールできました。      

[node-easel]のインストールも、githubを参照してください。筆者の環境(OS X)ですと、node-canvasをインストールした後、
[node-easel]:https://github.com/wdamien/node-easel
[github]:https://github.com/wdamien/node-easel
```sh
PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/opt/X11/lib/pkgconfig npm install canvasと
```
と実行してインストールできました。

#### デモに必要なライブラリのインストール
socket.ioやnode-oauth等を使用してしております。
```sh
npm install
```
よりインストールしてください。

#### Twitter APIのアプリケーション登録
Twitterアイコン画像の取得には、Twitter APIのアプリケーション登録が必要です。各設定情報を /server_modules/oauthModule.js に記述してください。

#### デモの起動
```sh
node server
```

#### デモの機能
http://localhost:5000 でデモのメイン画面  
http://localhost:5000/controller.html でデモのコントローラ画面が起動します。
