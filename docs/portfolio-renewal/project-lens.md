# Project Lens 実装メモ

確認日: 2026-07-25
対象Issue: [#17 Project LensでSelected Workを探索できるようにする](https://github.com/koba1108/profile/issues/17)

## 採用元

- [Canvas UI Magnify](https://canvasui.dev/docs/components/magnify)
- registry: `@canvas-ui/magnify-react`
- upstream基準commit: `728550d4523e1b8bef834b64b3e936c215cad630`
- license: MIT + Commons Clause

registryのReact sourceを`src/components/canvasui/Magnify.tsx`へ取り込み、リポジトリ内で監査・調整する。実行時にCanvas UI、CDN、外部assetへ接続しない。
著作権・許諾・Commons Clause・無保証の全文は[`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)へ同梱し、Magnifyの配布chunkにもlegal noticeを保持する。

## 体験の境界

Project LensはSelected Workのprogressive enhancementで、初期状態はOFFとする。fine pointerを持つ環境でユーザーが明示的にONにしたときだけMagnifyのlazy chunkを取得する。

- 通常HTMLを唯一の操作・アクセシビリティ面としてCanvas外へ常設する
- output Canvasは`aria-hidden`かつ`pointer-events: none`とする
- CanvasはSelected Work全体に1 instanceだけ生成する
- Work詳細button、dialog、keyboard、focusは通常HTMLが処理する
- 状態を保存せず、再訪時もOFFから始める

Magnifyが利用する`html-in-canvas`は実験的機能である。対応環境では公開済み情報だけで作る`aria-hidden`・`inert`な非操作キャプチャ面をtexture化する。未対応環境では通常HTMLの上にHUDとrippleだけを描く互換modeとし、live magnificationを必須にしない。Origin Trial tokenやhosting変更は導入しない。

## Canvas UIからの調整

- 操作用の`children`をsource Canvasへ移さず、常に通常DOMへ残す
- capture対象とpointer interaction対象を分離する
- capture面は`PublishedWork`由来の公開済み表示項目だけで構成する
- ON操作時にWebGL2 APIの存在をcontext生成なしでpreflightする。API自体がなければlazy chunkを取得せず、context初期化失敗はchunk側で通常表示へ戻す
- shader compile / program linkの失敗をConsoleへ出さず、値を含まないErrorへ正規化する
- WebGL context lossをfallbackへ通知する
- module / WebGL失敗時はLensをunmountし、通常HTMLへ戻す
- OFF、fallback、unmount時にRAF、observer、listener、readout、texture、shader、buffer、programを解放する

## フォールバック

次の場合はMagnify chunkを取得せず、通常HTMLだけを表示する。

- `prefers-reduced-motion: reduce`
- Data Saver (`navigator.connection.saveData`)
- fine pointer / hoverを持たない環境

module load、WebGL2、shader、program link、context lossの失敗は、読み込み済みのLensを破棄して通常HTMLへ戻す。fallback reasonは固定codeだけをDOMへ置き、Error詳細や表示内容をConsoleへ記録しない。

## Privacyと配布物

Project Lensは案件データ、公開判定、metadata、連絡先を変更しない。capture面へ渡すのは`selectPublishedWorks`を通過した既存公開情報だけで、外部画像、任意URL、analytics、telemetry、保存領域を追加しない。

`react-dist`ではMagnifyをexact 1 lazy chunkとして許可する。main chunkと`index.html`へshader実装やpreloadを混入させず、配布物全体の2MB上限とrepository・artifact privacy監査を維持する。

## 検証

- unit: 初期OFF、ON/OFF、reduced motion、Data Saver、coarse pointer、WebGL fallback、通常HTML維持
- browser: OFF時chunk 0、ON時chunk 1・Canvas 1、Work詳細とkeyboard、3 viewport、axe
- network: `/profile/`内のsame-origin build asset以外の追加通信なし
- runtime: Console errorなし、WebGL失敗時も通常HTMLへ復帰
- build: Magnifyは30KB以下の独立lazy chunk、配布物は完全allowlistの9 files
- performance: mobile 3回のLighthouse中央値で既存閾値を維持
