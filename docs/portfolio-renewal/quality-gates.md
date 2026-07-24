# React版 品質ゲート

最終更新日: 2026-07-25
対象Issue: [#6 テスト・アクセシビリティ・SEO・性能を整備する](https://github.com/koba1108/profile/issues/6)、[#8 Hugoを撤去し、READMEと保守手順を更新する](https://github.com/koba1108/profile/issues/8)

## 公開境界

公開assetは`react-public/`だけをViteへ渡す。Hugo source、theme submodule、旧static assetは撤去済みであり、repository監査で再追加を拒否する。

- OGP: 現行公開サイトで確認済みの氏名、ハンドル、役割表記と抽象的なYKだけを使用
- favicon: 抽象的なYKだけを使用
- canonical: `https://koba1108.github.io/profile/`
- 未承認のSNSアカウント、連絡先、所在地、案件情報はmetadataへ追加しない
- `profile.roles`、`headline`、`introduction`など`provisional`の文言はmetadataとOGPへ転用しない
- `verify:repo`は撤去済みpathの不在、repository全体のPII・privacy baseline、旧binary digest、binary path + SHA-256 allowlist、公開sourceの禁止参照を検査
- privacy baselineは非公開値を現行sourceやlogへ保存せず、immutableな移行前commitからメモリ内だけで取得する
- `react-dist`は配布fileの完全allowlist、PII形式、privacy baseline、禁止URL・path、metadata完全一致、OGPの寸法・chunk、base path、lazy chunk分離を`verify:dist`で検査

## 自動チェック

```bash
npm run check
npm run test:e2e
npm run test:lighthouse
npm audit --audit-level=moderate
npm audit --omit=dev --audit-level=moderate
```

`npm run check`はrepository監査、型、lint、Vitest、privacy policyのNode test、本番build、React配布物監査を順に実行する。

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

## 移行完了後の境界

- Pages workflowは`react-dist`だけをuploadする
- Pull Requestと`main` deployの両方で同じrepository・privacy gateを通す
- Hugo source、旧asset、submoduleを復元しない
- 非公開対象の値を検査証跡へ記録しない
