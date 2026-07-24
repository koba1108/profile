# 現行サイト基準状態

確認日: 2026-07-24
対象Issue: [#2 現行サイトを調査し、掲載コンテンツを確定する](https://github.com/koba1108/profile/issues/2)

## リポジトリ

| 項目 | 確認結果 |
| --- | --- |
| リポジトリ | `koba1108/profile` |
| 既定ブランチ | `main` |
| 基準コミット | `8f7ac1d` |
| 現行ジェネレーター | Hugo |
| テーマ | `hugo-developer-portfolio`（Gitサブモジュール） |
| 公開ワークフロー | `.github/workflows/gh-pages.yml` |
| Hugo出力先 | `dist` |

## 公開サイト

| 項目 | 確認結果 |
| --- | --- |
| URL | <https://koba1108.github.io/profile/> |
| HTTPステータス | `200` |
| ページタイトル | `小林良昇 - システムエンジニア / CTO / テックリード` |
| 公開HTMLのgenerator | Hugo `0.133.0` |
| 公開HTMLのlast-modified | 2024-08-26 |
| Console warning / error | なし |
| GitHub Actions実行履歴 | なし |

公開ページは閲覧できる一方、GitHub Actionsには実行履歴がないため、現行ワークフローから公開されたことを履歴で追跡できない。React版への切り替え時は、Actionsの成功とPages deploymentをそれぞれ確認する。

## スクリーンショット

- [デスクトップ 1440 × 900（Hero〜Experience）](../screenshots/issue-2/current-desktop.jpg)
- [モバイル 375 × 812（Hero〜Experience）](../screenshots/issue-2/current-mobile.jpg)

公開リポジトリへ個人メールアドレスと市区町村を複製しないため、Footerの直前までをキャプチャした。Footerの構成と公開情報は、本文の「現行表示で確認した改善対象」とコンテンツ移行表に値を複製せず記録する。

取得条件:

- Browser: Google Chrome
- Device pixel ratio: `1`
- Desktop viewport: `1440 × 900`
- Mobile viewport: `375 × 812`
- ブラウザのズーム値は変更していない

## Hugoビルド

ローカル環境にはHugoがインストールされていなかったため、テーマのサブモジュールを初期化したうえで公式Dockerイメージを使用した。

```shell
git submodule update --init --recursive
docker run --rm \
  -v "$PWD:/project" \
  -w /project \
  ghcr.io/gohugoio/hugo:v0.164.0 \
  --minify
```

結果:

- ビルド成功
- Pages: 8
- Static files: 13
- 出力先: `dist`

警告:

- `languageCode`など、Hugoの新しいバージョンで非推奨になった設定・テーマAPIがある
- `content/about.md`の`<br/>`はGoldmarkの既定設定で省略される

React版のローカル検証が完了するまで、これらを理由にHugo構成を変更・削除しない。

## 現行表示で確認した改善対象

1. Gmailリンクで設定済みアドレスへ`@gmail.com`が重複して付加される
2. 個人メールアドレスがトップ、About、フッターの複数箇所で公開されている
3. 詳細住所と住所を含むGoogle Maps URLが公開されている
4. Facebookの個人プロフィールが公開されている
5. 年齢が固定値で掲載されている
6. フッター年が`2024`で固定されている
7. スキル・経験アイコンを外部URLから直接読み込んでいる
8. ページ内に複数の`h1`があり、Skillsの直下が`h4`になるなど見出し階層が不連続
9. 経験が役割と技術スタック中心で、課題・判断・成果を確認できない
10. 現行テーマの大きな余白と横方向の配置により、情報の優先順位を把握しづらい
11. ナビゲーション外の`/profile/slides/services.md`と`services.html`も公開され、Markdown版には個人連絡先が残っている
12. `/profile/images/profile.jpg`が直接取得可能で、写真の利用許諾とReact版への移行可否が未確認
13. 375px幅ではExperienceカードが約2列で並び、見出しと技術スタックの改行が多く短時間で読み取りにくい

個人メールアドレス自体は移行資料へ複製しない。この不具合はReact版の要件へ引き継ぐ。

## 公開環境で404になる参照

| 参照元 | 現行参照先 | 原因 |
| --- | --- | --- |
| OGP画像 | `/images/hero.jpg` | Project Pagesの`/profile/`を含まず、対応ファイルもない |
| RSS | `/index.xml` | `baseURL`がProject Pagesのパスを含まない |
| Web App Manifest 192px icon | `/android-chrome-192x192.png` | Manifest内がルート絶対パス |
| Web App Manifest 384px icon | `/android-chrome-384x384.png` | Manifest内がルート絶対パス |
| ヘッダーの空リンク | `https://koba1108.github.io/` | Project Pagesのルートサイトは存在しない |

Androidアイコン本体は`/profile/`配下ではHTTP 200であり、ファイル欠落ではなく参照パスの問題である。

## React版との比較で維持する条件

- 公開URLを`https://koba1108.github.io/profile/`から変更しない
- 名前、役割、主要経験、GitHubへの導線を失わない
- 静的サイトとして運用し、サーバーやデータベースを追加しない
- React版がローカルと公開環境で確認できるまでHugo版を維持する
- 公開内容に本人確認が必要な場合は仮文言またはTODOで止め、推測で補完しない
- ナビゲーションにない静的ファイルも公開対象として棚卸しし、React版公開後のHugo撤去時に残存を確認する
