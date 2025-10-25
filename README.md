# Pixel Grid

## Recommended Environment
This tool is designed for use on a PC with the Google Chrome browser. Operation on other devices or browsers is not guaranteed.

## 推奨環境
このツールは、PC上のGoogle Chromeブラウザでの使用を想定しています。他のデバイスやブラウザでの動作は保証されていません。

## Demo
You can try this tool on the page below.

https://black-sesame-ice-cream.github.io/pixel-grid/

## デモ
以下のページでこのツールを試すことができます。

https://black-sesame-ice-cream.github.io/pixel-grid/

## Overview
Pixel Grid is a simple web-based tool for creating pixel art. You can draw on a resizable grid and save your creation as a PNG image with a transparent background. It features rulers and adjustable subgrid lines to make drawing large-scale art easier.

## 概要
Pixel Gridは、ピクセルアートを作成するためのシンプルなWebツールです。サイズ変更可能なグリッド上に描画し、作成した作品を透明な背景のPNG画像として保存できます。大規模なアートを描きやすくするために、目盛（ルーラー）と調整可能な補助グリッド線（Subgrid）を備えています。



## Usage
- **Drawing & Erasing**: Click and drag your mouse on the canvas to draw black pixels. Clicking on an existing black pixel will erase it.
- **Adjusting Grid Size**: Use the slider or the `+` / `-` buttons to change the grid size, ranging from 1x1 to 64x64. If you have already drawn on the canvas, a confirmation dialog will appear as resizing will clear your work.
- **Adjusting Subgrid Size**: Use the "Subgrid Size" slider to set an interval for thicker guide lines. The rulers on the top and left will display numeric coordinates corresponding to these lines, helping you grasp the overall structure.
- **Saving**: Click the `Save as PNG` button to download your artwork. The image will be saved with a transparent background.
- **Clearing**: Click the `Clear` button to reset the entire canvas. A confirmation dialog will appear.

## 使い方
- **描画と消去**: キャンバス上でマウスをクリック＆ドラッグすると、黒いピクセルを描画できます。すでに描画されている黒いピクセルをクリックすると、そのピクセルを消去します。
- **グリッドサイズの調整**: スライダーまたは `+` / `-` ボタンを使用して、グリッドサイズを1x1から64x64の範囲で変更できます。キャンバスに描画内容がある場合、リサイズすると内容がクリアされるため、確認ダイアログが表示されます。
- **補助グリッドサイズの調整**: 「Subgrid Size」のスライダーを使い、太いガイドラインを表示する間隔を設定できます。上下の目盛には、この線に対応する座標の数字が表示され、全体構造を把握するのに役立ちます。
- **保存**: `PNGとして保存` ボタンをクリックすると、作品がダウンロードされます。画像は透明な背景で保存されます。
- **クリア**: `クリア` ボタンをクリックすると、キャンバス全体がリセットされます。実行前に確認ダイアログが表示されます。

## Licenses
Please see below for details.

[License](LICENSE/)

[Third-Party Licenses](THIRD-PARTY-LICENSES.txt/)

## ライセンス
以下を参照してください。

[ライセンス](LICENSE/)

[第三者ライセンス](THIRD-PARTY-LICENSES.txt/)

## Tech Stack
This project is built with standard web technologies and a couple of libraries for PNG compression.
- HTML
- CSS
- JavaScript
- **Libraries**
  - [UPNG.js](https://github.com/photopea/UPNG.js) - For encoding PNG files.
  - [pako](https://github.com/nodeca/pako) - A zlib port for fast DEFLATE compression, used by UPNG.js.