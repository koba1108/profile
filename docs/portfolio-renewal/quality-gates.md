# React版 品質ゲート

確認日: 2026-07-24
対象Issue: [#6 テスト・アクセシビリティ・SEO・性能を整備する](https://github.com/koba1108/profile/issues/6)

## 公開境界

React版の公開assetは`react-public/`だけをViteへ渡す。旧Hugoの`static/`には人物写真やlegacy assetがあるため、React buildへコピーしない。

- OGP: 現行公開サイトで確認済みの氏名、ハンドル、役割表記と抽象的なYKだけを使用
- favicon: 抽象的なYKだけを使用
- canonical: `https://koba1108.github.io/profile/`
- 未承認のSNSアカウント、連絡先、所在地、案件情報はmetadataへ追加しない
- `profile.roles`、`headline`、`introduction`など`provisional`の文言はmetadataとOGPへ転用しない
- `react-dist`は配布fileの完全allowlist、PII形式、現行Hugoの非公開値fingerprint、metadata完全一致、OGPの寸法・chunk、base path、lazy chunk分離を`verify:dist`で検査

## 自動チェック

```bash
npm run check
npm run test:e2e
npm run test:lighthouse
npm audit --audit-level=moderate
npm audit --omit=dev --audit-level=moderate
```

`npm run check`は型、lint、Vitest、本番build、React配布物監査を順に実行する。

Playwrightは本番previewの`/profile/`を次の3幅で検証する。

| project | viewport |
| --- | --- |
| mobile | 375 x 812 |
| tablet | 768 x 1024 |
| desktop | 1440 x 1000 |

検証対象は主要導線、Work詳細、テーマ、モバイルメニュー、skip link、キーボードfocus・focus表示・dialog内focus、axe、画面幅別layout、横overflow、`/profile/`内same-origin通信、reduced motion、WebGL fallback、Console error、SEO metadataと画像asset。

## Lighthouse

モバイル条件で3回実行し、カテゴリごとの中央値を判定する。

| category | target | 2026-07-24 median |
| --- | ---: | ---: |
| Performance | 85 | 95 |
| Accessibility | 95 | 100 |
| Best Practices | 95 | 100 |
| SEO | 95 | 100 |

個別Performanceは82 / 95 / 95。初回のcold-startも含め、事前定義した3回中央値で合否を判定した。

Three.jsを含むParticle Objectはlazy chunkへ分離されている。reduced motionまたはData Saver時はParticle chunk自体を要求しない。

CIはdependency auditも実行し、browser testが失敗した場合に限り、公開画面だけを対象にしたPlaywright / Lighthouseの診断artifactを7日間保存する。

## Issue境界

- Issue #6では旧HugoのPages workflowを変更しない
- React版のGitHub Pages切替と公開URL検証はIssue #7で行う
- Hugo source、旧asset、READMEの撤去・更新はIssue #8で行う
