# Hero Particle Object 実装メモ

確認日: 2026-07-24
対象Issue: [#5 HeroにCanvas UIのParticle Objectを実装する](https://github.com/koba1108/profile/issues/5)

## 採用元

- [Canvas UI Particle Object](https://canvasui.dev/docs/components/particle-object)
- registry: `@canvas-ui/particle-object-react`
- 導入時のshadcn CLI: `4.14.1`
- 導入時の`three` / `@types/three`: `0.185.1`

`components.json`には公式namespaceの`@canvas-ui`を登録する。registryから取得したReact実装は`src/components/canvasui/ParticleObject.tsx`へ配置し、リポジトリ内で監査・調整できる状態にする。

## 公開素材

本人写真や既存プロフィール画像は使用しない。React版で新しく作成した`src/assets/yk-particle.svg`だけを利用する。

- 表示内容は`YK`の抽象的なモノグラム
- 顔、住所、連絡先、顧客名、案件情報などの非公開情報を含まない
- SVGはリポジトリ内の固定assetで、実行時アップロードや任意URL入力を提供しない

## Canvas UIからの調整

ポートフォリオの用途を超える機能と外部通信を削る。

- GLTF、GLB、Draco loaderを削除
- gstaticのDraco decoder参照を削除
- asset fetchをsame-originのSVG / PNG / JPEG / WebP / GIFだけに制限
- asset変更・アンマウント時に進行中fetchを`AbortController`で中止
- `maxDpr`を追加し、画面幅ごとの描画負荷を制限
- renderer生成前にWebGL2をpreflightし、console errorを出さずに初期化失敗を`onError`へ通知
- `webglcontextlost`を`onError`へ通知
- viewport外と`document.hidden`時は`setAnimationLoop(null)`でloop自体を停止
- Intersection Observer非対応時もscroll / resizeで表示領域を判定してloopを停止
- destroy時にobserver、media query、pointer、visibility、context lostのlistenerとGPU resourceを解放

## 描画プロファイル

| profile | 条件 | particles | max DPR | cursor radius |
| --- | --- | ---: | ---: | ---: |
| mobile | 767px以下 | 2,500 | 1.0 | 72 |
| tablet | 768px〜1023px | 4,000 | 1.25 | 90 |
| desktop | 1024px以上 | 7,000 | 1.5 | 105 |

自動回転、zoom、drag orbitは無効にする。idle driftとfloat/rotationは弱くし、カーソルのpushとspring backだけを主要な操作反応として残す。
カメラ操作が無効な間はOrbitControlsをDOMから切断し、モバイルの縦スクロールをCanvasで阻害しない。

## フォールバック

静的YK表示をCanvasと同じ固定aspect ratio内に常設し、次の場合はCanvasをmountしないか、直ちにunmountする。

- `prefers-reduced-motion: reduce`
- Data Saver (`navigator.connection.saveData`)
- lazy chunkの読込失敗
- WebGL初期化失敗
- YK SVGのload / decode失敗
- WebGL context lost

Canvasは装飾であり`aria-hidden`とする。Heroの見出し、紹介文、Selected Work、GitHub CTAはCanvasの状態に依存しない。

## 検証

- unit: loading / ready / error / reduced motion / Data Saver / mobile profile
- browser: 375px、768px、1440pxの表示、横overflow、theme連動
- browser: Canvasあり、reduced motion、WebGL失敗fallback
- lifecycle: viewport外、再表示、アンマウント、context lost
- network: GitHub公開リンクとsame-origin asset以外の追加通信なし
- build: Canvas UI / Three.jsはlazy chunkへ分離し、初期bundleへ含めない
