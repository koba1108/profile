# React版 GitHub Pagesデプロイ手順

確認日: 2026-07-24
対象Issue: [#7 React版をGitHub Pagesへデプロイする](https://github.com/koba1108/profile/issues/7)

## 公開構成

- 公開URL: <https://koba1108.github.io/profile/>
- Pages source: GitHub Actions
- deploy可能branch: `main`
- build出力: `react-dist`
- Vite base path: `/profile/`
- environment: `github-pages`

`.github/workflows/gh-pages.yml`は`main`へのpushまたは`main`を対象にした手動実行で、依存固定install、dependency audit、型チェック、lint、Vitest、本番build、公開物監査、3 viewport E2E、axe、Lighthouseを行う。最後に再監査した`react-dist`だけをPages artifactへアップロードし、全gate成功後にdeployする。

`.github/workflows/react-quality.yml`はPull Requestと手動の品質確認を担当し、`main`ではPages workflowが同じ全gateを実行する。これにより、直接pushでもdeploy前gateを省略せず、同一commitの重複実行も避ける。

## 公開境界

- Hugoの`dist`、`static`、`content`、`data`はPages artifactへ含めない
- React artifactは`scripts/verify-react-dist.mjs`の完全allowlistに一致した8 fileだけを許可する
- 現行Hugoで非公開扱いにした年齢、詳細住所、個人メール、Facebook、地図、人物写真、旧資料、未公開案件情報は公開しない
- React版の公開確認が完了するまでHugo sourceと旧assetを削除しない

## デプロイ確認

1. GitHub Pages workflowの`build`と`deploy`が成功している
2. deployment URLが`https://koba1108.github.io/profile/`である
3. `/profile/`を再読み込みしてHTTP 200になる
4. HTML、CSS、JavaScript、favicon、manifest、OGP、Particle Object、YK SVGがHTTP 200になる
5. desktop 1440pxとmobile 375pxでHero、Selected Work、Capabilities、About、Contactを表示できる
6. ページ内navigation、テーマ切替、Work詳細、mobile menu、GitHub / Contactリンクが機能する
7. reduced motionまたはWebGL失敗時も静的YKと主要情報を表示できる
8. Console error、4xx / 5xx response、`/profile/`外のsame-origin request、意図しない外部requestがない
9. title、description、canonical、OGP、Twitter Cardが承認済みの値である
10. 旧Hugoの非公開asset URLがReact版から参照・配信されていない

全項目のproduction smokeは、公開後に次で再実行する。

```bash
npm run test:e2e:published
```

このcommandはローカルserverを起動せず、公開URLへ3 viewportのPlaywright suiteを実行する。外部リンクは実際に遷移せず承認済みURLと安全属性を確認し、旧Hugo限定assetは分類ごとのHTTP statusだけを検証する。

確認結果はIssue #7またはPull Requestへ、workflow run、deployment URL、確認viewport、Console / network結果とともに記録する。非公開値そのものは証跡へ転記しない。

## ロールバック

公開後に問題を見つけた場合は、理由にかかわらず、既知の非公開対象を含む旧Hugo版へ戻さない。公開確認を中止してIssue #8を止め、問題の機能を除いた検査済みの最小React修正版を緊急PRで再deployする。修正版も通常と同じprivacy監査、`react-dist`限定upload、レビューを省略しない。

直ちに封じ込める方法が修正版deploy以外に必要な場合は、Pages停止などの外部状態変更を行う前にユーザーへ報告して判断を求める。証跡には非公開値そのものを記載しない。旧Hugo sourceは原因比較用としてIssue #8まで保持するが、再公開用artifactとしては使用しない。

Issue #8のHugo撤去は、React版のworkflow、公開URL、desktop / mobile、privacy境界の確認がすべて完了してから開始する。
