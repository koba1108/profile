# ykoba portfolio

小林 良昇（ykoba）のポートフォリオです。React、Vite、TypeScriptで構築し、GitHub Pagesの`/profile/`で公開しています。

- 公開URL: <https://koba1108.github.io/profile/>
- Node.js: 24
- package manager: npm（`package-lock.json`で固定）
- Pages artifact: `react-dist`

## セットアップ

```bash
npm ci
npm run dev
```

開発サーバーのURLはViteの出力を確認してください。Project Pagesと同じbase pathとして`/profile/`を使用します。

クリーンなcheckoutで再現する場合も、追加のsubmoduleやHugoは不要です。

```bash
git clone https://github.com/koba1108/profile.git
cd profile
npm ci
npx playwright install chromium
npm run check
```

privacy gateは非公開値を現行sourceへ保存せず、immutableな移行前commitをメモリ内で照合するため、履歴を省略しないcheckoutが必要です。shallow cloneでは`git fetch --unshallow`を先に実行してください。

## 開発・品質確認

| 目的 | command |
| --- | --- |
| 開発サーバー | `npm run dev` |
| 型チェック | `npm run typecheck` |
| lint | `npm run lint` |
| unit test | `npm run test` |
| 本番build | `npm run build` |
| repository・公開物を含む標準gate | `npm run check` |
| 3 viewport E2E・axe | `npm run test:e2e` |
| Lighthouse | `npm run test:lighthouse` |
| 本番preview | `npm run preview` |
| 公開URLのproduction smoke | `npm run test:e2e:published` |

`npm run build`は`react-dist/`を作成します。`npm run check`はHugo関連pathの不在、公開sourceのPII・禁止参照、型、lint、unit test、build、配布物の完全allowlistを検証します。

E2EとLighthouseを初めて実行する環境では、使用するChromiumを先に導入します。Linux CIでOS依存も導入する場合は`npx playwright install --with-deps chromium`を使用します。

```bash
npx playwright install chromium
```

ローカルの本番表示は次で確認できます。

```bash
npm run build
npm run preview
```

## コンテンツ更新

- プロフィール: `src/content/profile.ts`
- Selected Work: `src/content/works.ts`
- Capabilities: `src/content/capabilities.ts`
- Engineering Approach: `src/content/approach.ts`
- ナビゲーション・画面文言: `src/content/navigation.ts`、`src/content/page.ts`

Selected Workは、既存公開情報のimmutable sourceと本人承認が揃った項目だけを`src/lib/publication.ts`で公開用データへ変換します。Challenge、Decisions、Outcome、未確認候補は値をsourceへ置かず、DOM、client bundle、metadataにも含めません。

新しい掲載内容を追加するときは、公開根拠と本人承認を先に記録し、型・公開判定・unit testを同じPRで更新してください。推測した成果、顧客名、社名、内部事情を追加しないでください。

## アセット更新

- favicon・manifest・OGP: `react-public/`
- アプリ内SVG: `src/assets/`
- OGPの編集元: `docs/portfolio-renewal/ogp-source.svg`

`react-public/ogp.png`は1200x630、500KB以下、承認済みPNG chunkだけを許可します。`react-dist`はHTML、CSS、JavaScript、favicon、manifest、OGP、Particle Object、Project Lens、YK SVGの9 fileだけを許可し、source mapや未承認fileを配信しません。

アセットを追加・変更する場合は、`scripts/verify-react-dist.mjs`のallowlistとprivacy境界を意図的にレビューし、`npm run check`と`npm run test:e2e`を通してください。

Selected WorkのProject Lensは初期OFFです。fine pointer環境で明示的にONにした場合だけCanvas UI Magnifyをlazy loadし、通常HTMLと詳細操作は常に残します。reduced motion、Data Saver、touch中心、module / WebGL失敗時は追加chunkを取得しないか、通常表示へ戻します。設計と安全境界は[Project Lens実装メモ](docs/portfolio-renewal/project-lens.md)を参照してください。

## 非公開情報

旧ポートフォリオで非公開対象とした年齢、詳細住所、個人メール、Facebook、地図、人物写真、旧資料、未公開案件情報は、新しいポートフォリオでも公開しません。

- 非公開値をsource、fixture、コメント、画像metadataへ保存しない
- 非公開値をDOM、client bundle、OGP、manifest、Console、テスト証跡へ出さない
- Contactは承認済みGitHub URLだけを使用する
- 公開artifactは`react-dist`だけとし、完全allowlist、PII形式、禁止URL・path、metadata完全一致を監査する
- immutableな移行前commitから値を表示せずprivacy baselineを復元し、repository全体、配布物、旧binary digestの一致を拒否する
- binary assetはpathと承認済みSHA-256の両方を固定し、画像変更を明示的なprivacyレビュー対象にする
- 非公開情報の掲載が必要になった場合は、本人の明示承認と専用のレビューを先に行う

## デプロイ

Pull Requestでは`.github/workflows/react-quality.yml`が標準gate、E2E、Lighthouseを実行します。`main`へmergeすると`.github/workflows/gh-pages.yml`が同じgateを再実行し、成功した`react-dist`だけをGitHub Pagesへデプロイします。

公開後は次を実行し、表示、主要操作、base path、アセット、Console、旧assetの404を確認します。

```bash
npm run test:e2e:published
```

詳細は[デプロイ手順](docs/portfolio-renewal/deployment-runbook.md)と[品質ゲート](docs/portfolio-renewal/quality-gates.md)を参照してください。問題発生時も、非公開対象を含む旧Hugo版には戻さず、privacy監査を通した最小React修正版をデプロイします。
