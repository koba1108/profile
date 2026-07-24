# コンテンツ移行表

確認日: 2026-07-24
対象Issue: [#2 現行サイトを調査し、掲載コンテンツを確定する](https://github.com/koba1108/profile/issues/2)

## 分類ルール

| 分類 | 意味 |
| --- | --- |
| 移行 | 現行情報をReact版へ引き継ぐ |
| 再構成 | 事実は引き継ぎ、表現や情報構造を変える |
| 削除 | React版へ掲載しない |
| 本人確認 | 公開範囲や文言を本人が確定するまでTODOにする |

成果・規模・担当範囲は、現行サイトに記載された事実だけを初期値として扱う。公開可能な数値や成果は推測しない。

## 基本情報と連絡先

| 現行情報 | 出典 | 移行方針 | React版での扱い |
| --- | --- | --- | --- |
| 小林 良昇 / Yoshinobu Kobayashi / ykoba | `data/homepage.yml`, `content/about.md` | 移行 | HeroとAboutに掲載。英字表記は本人確認 |
| システムエンジニア / CTO / テックリード | `data/homepage.yml`, `hugo.toml` | 再構成 | `CTO / Tech Lead / Product Engineer`を仮の役割表記とする |
| 年齢の固定値 | `content/about.md` | 削除 | 年齢は掲載しない |
| 市区町村レベルの詳細住所と地図URL | `content/about.md`, `hugo.toml` | 削除 | 詳細住所と地図URLを削除する |
| 所在地 | 計画書 | 本人確認 | 掲載する場合は`Tokyo, Japan`程度に留める |
| GitHub `koba1108` | `data/homepage.yml`, `content/about.md` | 移行 | 主要CTAとContactに掲載 |
| 個人メールアドレス | `data/homepage.yml`, `content/about.md`, `hugo.toml` | 本人確認 | 公開用メールまたは別の安全な連絡手段が確定するまで掲載しない |
| Facebook個人プロフィール | `data/homepage.yml`, `content/about.md` | 本人確認 | 仕事上の連絡先として必要と確認できた場合だけ残す |

## 現行ソースとReact版の対応

| 現行ソース | 主な内容 | React版の移行先 | 方針 |
| --- | --- | --- | --- |
| `data/homepage.yml:banner` | 名前 | Hero | 移行 |
| `data/homepage.yml:about` | 役割、About導線 | Hero / About | 再構成 |
| `data/homepage.yml:social` | GitHub、Facebook、個人メール | Header / Contact | GitHub以外は本人確認 |
| `data/homepage.yml:skill` | 6スキルと外部アイコン | Capabilities | 5カテゴリへ再構成し、外部画像は廃止 |
| `data/homepage.yml:experience` | 主要経験4件 | Selected Work | ケーススタディ形式へ再構成 |
| `content/about.md:基本情報` | 氏名、年齢、住所 | About | 氏名以外は削除または本人確認 |
| `content/about.md:概要` | 自己紹介 | Hero / About | 抽象的な自己評価を具体的な経験へ置換 |
| `content/about.md:専門スキル` | 言語、フレームワーク、クラウド、DB | Capabilities | 能力説明を主、技術名をBadgeにする |
| `content/about.md:主要プロジェクト経験` | 5案件の役割、Stack、担当 | Selected Work | 4件を初期候補とし、不足項目は本人確認TODO |
| `content/about.md:技術的専門性` | Architecture、性能、DB、API、DevOps | Capabilities / Engineering Approach | 重複を統合して再構成 |
| `content/about.md:お問い合わせ` | GitHub、Facebook、個人メール | Contact | GitHub以外は本人確認 |
| `hugo.toml:params` | description、author、OGP画像 | SEO / Metadata | descriptionを再作成し、OGP画像をローカル化 |
| `hugo.toml:params.footer` | 個人メール、住所、地図URL | Contact / Footer | React版へ自動移行しない |
| `hugo.toml:menu` | Home、About | Header | 1ページ内リンクへ置換 |
| `hugo.toml:plugins` | UIkit CDN | なし | React版では削除 |
| `static/slides/services.md` | サービス紹介資料、個人連絡先 | なし | React版へ移行せず、Hugo撤去時に削除 |
| `static/slides/services.html` | Markdown版と同期していない生成済み資料 | なし | React版へ移行せず、Hugo撤去時に削除 |
| `static/images/profile.jpg` | 人物写真 | Canvas / About候補 | 本人性、撮影者、利用許諾、背景公開可否を確認 |
| `static/favicon*`, `static/*-icon.png`, `static/site.webmanifest` | Hugo版のfaviconとPWAアイコン | SEO / Metadata | Issue #6でReact版向けに再生成し、Issue #8で旧資産を削除 |

### 公開資産台帳

`current`はIssue #2時点の状態、`target`はIssue #8完了時に許容する状態を表す。

| 公開資産 | current | target | owner issue |
| --- | --- | --- | --- |
| `static/android-chrome-192x192.png` | pending | replaced / deleted | #6, #8 |
| `static/android-chrome-384x384.png` | pending | replaced / deleted | #6, #8 |
| `static/apple-touch-icon.png` | pending | replaced / deleted | #6, #8 |
| `static/favicon-16x16.png` | pending | replaced / deleted | #6, #8 |
| `static/favicon-32x32.png` | pending | replaced / deleted | #6, #8 |
| `static/favicon.ico` | pending | replaced / deleted | #6, #8 |
| `static/mstile-150x150.png` | pending | replaced / deleted | #6, #8 |
| `static/safari-pinned-tab.svg` | pending | replaced / deleted | #6, #8 |
| `static/browserconfig.xml` | pending | replaced / deleted | #6, #8 |
| `static/site.webmanifest` | pending | replaced / deleted | #6, #8 |
| `static/images/profile.jpg` | pending | migrated / deleted | #5, #8 |
| `static/slides/services.md` | pending | deleted | #8 |
| `static/slides/services.html` | pending | deleted | #8 |

Issue #8では各行の`current`を`migrated`、`replaced`、`deleted`のいずれかへ更新し、`pending`が残っていないことを確認する。

## Hero

| 項目 | 初期値 | 状態 |
| --- | --- | --- |
| 名前 | 小林 良昇 / ykoba | 移行 |
| 役割 | CTO / Tech Lead / Product Engineer | 仮文言 |
| メインメッセージ | 技術と事業をつなぎ、0→1から運用までプロダクトを前進させる。 | 本人確認 |
| 紹介文 | 設計・実装・チームづくりを横断してきたことを1〜2文で表現する | 本人確認 |
| CTA | `View selected work` / `GitHub` | 移行 |
| Canvas素材 | YK SVGまたはプロフィール写真 | 本人確認 |

本人確認が終わるまでは、計画書のメインメッセージを仮文言としてUI実装に使用してよい。

## Selected Work

現行トップページですでに主要経験として扱われている次の4件を、Selected Workの実装対象として選定する。掲載する案件の選定と、各フィールドの公開承認は分けて管理する。公開承認が終わるまでは本番表示せず、本人確認で差し替えられるよう型付きデータとして分離する。

### 1. ライブ配信プラットフォーム

出典: `data/homepage.yml:experience`, `content/about.md:主要プロジェクト経験`

| 項目 | 初期値 |
| --- | --- |
| Context | ライブ配信プラットフォームの立ち上げ |
| Role | 取締役・CTO |
| Summary | ライブ配信プラットフォームの立ち上げで、システム全体設計、開発チームマネジメント、バックエンド・フロントエンド実装を担当（provisional） |
| Challenge | TODO: 公開可能な課題を本人確認 |
| Decisions | TODO: 公開可能な設計・技術判断を本人確認 |
| Outcome | TODO: 公開可能で根拠のある成果を本人確認 |
| Stack候補（`homepage.yml`） | AWS, Go, Nuxt.js, Firestore, DynamoDB, OpenSearch |
| Stack候補（`about.md`） | Go, Vue.js, JavaScript, HTML5, CSS3, DynamoDB, Docker, Amazon S3, API Gateway, Lambda, Gin, Nuxt.js, SCSS, Stripe, Auth0 |
| 現行記載の担当 | システム全体設計、開発チームマネジメント、バックエンド・フロントエンド実装 |

| 公開判断項目 | 状態 |
| --- | --- |
| 実装対象への選定 | selected |
| 本番公開 | pending |
| 役割・担当範囲 | pending |
| Stack | pending |
| Challenge | pending |
| Decisions | pending |
| Outcome | pending |
| NDA・案件特定リスク | pending |

### 2. 婚活マッチングサービス

出典: `data/homepage.yml:experience`, `content/about.md:主要プロジェクト経験`

| 項目 | 初期値 |
| --- | --- |
| Context | 婚活マッチングサービスの立ち上げ |
| Role | CTO |
| Summary | 婚活マッチングサービスの立ち上げで、システム全体設計、開発チームマネジメント、バックエンド・フロントエンド実装を担当（provisional） |
| Challenge | TODO: 公開可能な課題を本人確認 |
| Decisions | TODO: 公開可能な設計・技術判断を本人確認 |
| Outcome | TODO: 公開可能で根拠のある成果を本人確認 |
| Stack候補（`homepage.yml`） | GCP, Go, Nuxt.js, GraphQL, MySQL, Firestore, BigQuery |
| Stack候補（`about.md`） | GCP, Go, Nuxt.js, GraphQL, MySQL, Firestore, BigQuery |
| 現行記載の担当 | システム全体設計、開発チームマネジメント、バックエンド・フロントエンド実装 |

| 公開判断項目 | 状態 |
| --- | --- |
| 実装対象への選定 | selected |
| 本番公開 | pending |
| 役割・担当範囲 | pending |
| Stack | pending |
| Challenge | pending |
| Decisions | pending |
| Outcome | pending |
| NDA・案件特定リスク | pending |

### 3. コンサル人材マッチングサービス

出典: `data/homepage.yml:experience`, `content/about.md:主要プロジェクト経験`

| 項目 | 初期値 |
| --- | --- |
| Context | コンサルティング人材マッチングサービスの開発 |
| Role | Lead Developer |
| Summary | コンサルティング人材マッチングサービスで、システム全体設計とバックエンド・フロントエンド実装を担当（provisional） |
| Challenge | TODO: 公開可能な課題を本人確認 |
| Decisions | TODO: 公開可能な設計・技術判断を本人確認 |
| Outcome | TODO: 公開可能で根拠のある成果を本人確認 |
| Stack候補（`homepage.yml`） | AWS, Go, Angular, GraphQL, DynamoDB, OpenSearch |
| Stack候補（`about.md`） | Go, Angular.js, TypeScript, HTML5, CSS3, DynamoDB, OpenSearch, Docker, Amazon S3, API Gateway, Lambda |
| 現行記載の担当 | システム全体設計、バックエンド・フロントエンド実装 |

| 公開判断項目 | 状態 |
| --- | --- |
| 実装対象への選定 | selected |
| 本番公開 | pending |
| 役割・担当範囲 | pending |
| Stack | pending |
| Challenge | pending |
| Decisions | pending |
| Outcome | pending |
| NDA・案件特定リスク | pending |

### 4. 転職・副業マッチングサービス

出典: `data/homepage.yml:experience`, `content/about.md:主要プロジェクト経験`

| 項目 | 初期値 |
| --- | --- |
| Context | 転職マッチングサービスの立ち上げ |
| Role | PM兼リードエンジニア |
| Summary | 転職マッチングサービスの立ち上げで、システム全体設計、開発チームマネジメント、バックエンド・フロントエンド実装を担当（provisional） |
| Challenge | TODO: 公開可能な課題を本人確認 |
| Decisions | TODO: 公開可能な設計・技術判断を本人確認 |
| Outcome | TODO: 公開可能で根拠のある成果を本人確認 |
| Stack候補（`homepage.yml`） | GCP, Go, Nuxt.js, MySQL, Cloud Pub/Sub |
| Stack候補（`about.md`） | Go, JavaScript, HTML5, CSS3, MySQL, Google App Engine, Cloud Pub/Sub, Gin, SQLBoiler, Nuxt.js, Vuetify |
| 現行記載の担当 | システム全体設計、開発チームマネジメント、バックエンド・フロントエンド実装 |

| 公開判断項目 | 状態 |
| --- | --- |
| 実装対象への選定 | selected |
| 本番公開 | pending |
| 役割・担当範囲 | pending |
| Stack | pending |
| Challenge | pending |
| Decisions | pending |
| Outcome | pending |
| NDA・案件特定リスク | pending |

NFTコンテンツマーケットプレイスは、Selected Workの4件には含めず、本人が優先したい場合の差し替え候補とする。

### 原典差異

| 案件 | 差異 | 扱い |
| --- | --- | --- |
| ライブ配信 | `homepage.yml`にはAWS、Firestore、OpenSearchがあり、`about.md`のStackとは一致しない | 自動統合せず、フィールド単位で本人確認 |
| コンサル人材マッチング | `homepage.yml`はAngular、`about.md`はAngular.js | 同一技術と推測せず本人確認 |
| 転職・副業マッチング | `homepage.yml`と`about.md`で役割表記と技術の粒度が異なる | 表示用RoleとStackを本人確認 |

Issue #4のデータには、フィールド単位で出典を追跡できる`sourceRefs`を持たせる。`Golang`から`Go`のような表記正規化と、技術項目の追加・削除は別の変更として扱う。

## Capabilities

現行のスキル一覧とAboutの専門性を、次の5カテゴリへ再構成する。

| カテゴリ | 移行する内容 | 表記を整理する技術 |
| --- | --- | --- |
| Product & Leadership | CTO、PM、リードエンジニア、チームマネジメント、0→1 | 役割を能力の説明へ変換 |
| Backend | API設計、マイクロサービス、イベント駆動、性能改善 | Go, Node.js, Gin, Echo, GraphQL, gRPC |
| Frontend | SPA、SSR、フルスタック開発 | TypeScript, React, Vue.js, Nuxt.js, Angular |
| Cloud & Architecture | クラウドネイティブ、サーバーレス、DB設計、IaC | AWS, GCP, Cloud Run, Lambda, Terraform |
| Delivery & DevOps | CI/CD、コンテナ、監視、外部サービス連携 | GitHub Actions, Docker, Kubernetes, Sentry |

表記は`Golang`を`Go`、`Typescript`を`TypeScript`、`firestore`を`Firestore`、`dynamodb`を`DynamoDB`へ統一する。

### 現行Skill説明の移行判断

| 現行項目 | 維持する事実 | 再構成または本人確認 |
| --- | --- | --- |
| Golang | Gin、EchoによるAPI開発、gRPCによるサービス間通信 | 「高性能」「同時接続数万」は根拠と公開可否を本人確認 |
| JavaScript / TypeScript | Vue.js、React、Angular、Nuxt.jsによるSPA・SSR開発 | 「大規模」は基準がないため仮文言から削除 |
| Database | MySQL、PostgreSQLの設計・最適化、DynamoDB、Firestoreとの併用 | 「大規模」「経験豊富」は具体的な事例確認まで使用しない |
| Infrastructure | AWS、GCPの設計・構築、CI/CDによるデプロイ自動化 | 「開発効率を最適化」は成果根拠の確認まで使用しない |
| DevOps & CI/CD | GitHub Actions、Jenkins、Docker、Kubernetes、Terraformの利用経験 | ツール一覧ではなくDelivery能力の説明へ統合 |
| Integration | Auth0、Stripe、Sentry、OpenAIなどの外部サービス連携 | 「セキュアで効率的」は評価根拠の確認まで使用しない |

### 現行「技術的専門性」の移行判断

| 現行項目 | React版の移行先 | 方針 |
| --- | --- | --- |
| マイクロサービスアーキテクチャ | Backend / Cloud & Architecture | 維持 |
| サーバーレスアプリケーション | Cloud & Architecture | 維持 |
| ドメイン駆動設計 | Cloud & Architecture | 本人確認後にBadgeまたは説明へ追加 |
| イベント駆動型システム | Backend / Cloud & Architecture | 維持 |
| システムのボトルネック分析 | Backend | 具体例の確認まで一般的な能力説明に留める |
| データベースクエリ最適化 | Backend | 維持 |
| フロントエンド性能改善 | Frontend | 具体例の確認まで一般的な能力説明に留める |
| RDBMSとNoSQLの選択・設計 | Backend / Cloud & Architecture | 維持 |
| シャーディング戦略 | Backend | 実務範囲を本人確認 |
| キャッシュ層の設計 | Backend | 実務範囲を本人確認 |
| REST API | Backend | 維持 |
| GraphQL API | Backend | 維持 |
| gRPC | Backend | 維持 |
| CI/CD | Delivery & DevOps | 維持 |
| コンテナオーケストレーション | Delivery & DevOps | Kubernetesの実務範囲を本人確認 |
| IaC | Delivery & DevOps / Cloud & Architecture | 維持 |

### 現行技術項目の全件分類

技術名は主役にせず、Capabilitiesの説明を補助するBadgeとして必要なものだけ表示する。

| 原典カテゴリ | 対象項目 | 分類 | React版での扱い |
| --- | --- | --- | --- |
| 言語 | Go, Node.js, TypeScript, JavaScript | 再構成 | Backend / Frontendの主要Badge |
| 言語 | HTML5, CSS3 | 再構成 | Frontendの補助Badge |
| 言語 | Python, PHP, Ruby | 本人確認 | 初期表示から省略し、現在の位置づけを確認 |
| Backend framework | Gin, Echo, Express | 再構成 | Backendの補助Badge |
| Backend framework | Laravel, FuelPHP, PhalconPHP, CakePHP | 本人確認 | 初期表示から省略し、現在の位置づけを確認 |
| Frontend framework | Vue.js, Nuxt.js, React, Angular | 再構成 | Frontendの主要Badge |
| Frontend framework | Angular.js | 本人確認 | Angularとの原典差異を確認 |
| Frontend framework | jQuery, Remix, Next.js | 本人確認 | 初期表示から省略し、現在の位置づけを確認 |
| API / communication | REST, GraphQL, gRPC | 再構成 | Backendの能力説明とBadge |
| GCP | Cloud Run, Google App Engine, Cloud Pub/Sub | 再構成 | Cloud & Architectureの説明またはBadge |
| AWS | S3, Lambda, API Gateway | 再構成 | Cloud & Architectureの説明またはBadge |
| Infrastructure | Docker, Docker Compose, Terraform | 再構成 | Cloud / Deliveryの説明またはBadge |
| Infrastructure | CloudFormation, Serverless Framework, Heroku | 本人確認 | 初期表示から省略し、現在の位置づけを確認 |
| Database | MySQL, PostgreSQL, DynamoDB, OpenSearch, Firestore, BigQuery | 再構成 | Backend / Cloudの主要Badge |
| Database | ElasticSearch | 本人確認 | OpenSearchとの表記・経験範囲を確認 |
| Database | Cloud Spanner | 本人確認 | 初期表示から省略し、経験範囲を確認 |
| Source control | GitHub | 移行 | ContactとDeliveryに利用 |
| Source control | GitLab, Bitbucket | 再構成 | 個別表示せずGit運用経験へ統合 |
| CI/CD | Jenkins, GitHub Actions | 再構成 | Delivery & DevOpsの説明またはBadge |
| External service | Stripe, Auth0, OpenAI, Sentry | 再構成 | Integration経験として必要に応じてBadge |
| External service | SendGrid | 本人確認 | 初期表示から省略し、現在の位置づけを確認 |

## 表示可能な仮文言

次の文言は計画書の情報設計と、現行ソースで確認できる役割・担当範囲を使った`provisional`な初期値であり、Issue #4のレビュー時に本人確認する。

### Hero

> CTO、PM、テックリード、開発者として、Webサービスの立ち上げから設計・実装、チーム運営まで横断してきました。バックエンド、フロントエンド、クラウドをつなぎ、継続して運用できるプロダクトづくりに取り組みます。

### Capabilities

| 能力名 | 説明 | Badge |
| --- | --- | --- |
| Product & Leadership | CTO、PM、リードエンジニアとして、サービス立ち上げ、システム設計、開発チームのマネジメントを担当してきました。 | CTO, PM, Tech Lead |
| Backend Engineering | API、マイクロサービス、イベント駆動システムを設計・実装し、RDBとNoSQLを用途に合わせて組み合わせます。 | Go, Node.js, GraphQL, gRPC |
| Frontend Engineering | SPAとSSRの開発経験をもとに、バックエンドとの境界を含めてWebアプリケーションを設計・実装します。 | TypeScript, React, Vue.js, Nuxt.js, Angular |
| Cloud & Architecture | AWSとGCPで、サーバーレス、コンテナ、データストアを運用条件に合わせて構成します。 | AWS, GCP, Lambda, Cloud Run, Terraform |
| Delivery & DevOps | CI/CD、コンテナ化、IaC、監視サービスの連携を通じて、変更を継続的に届けられる開発環境を整えます。 | GitHub Actions, Docker, Kubernetes, Sentry |

### Engineering Approach

3段階の見出しは計画書を出典とし、説明は現行サイトに記載されたシステム全体設計、バックエンド・フロントエンド実装、チームマネジメント、CI/CDの範囲に限定する。

1. **課題と事業条件を整理する**
   CTO、PM、リードエンジニアとしてサービス立ち上げとシステム全体設計を担当してきた経験をもとに、実装前提と担当範囲を整理します。
2. **継続可能なアーキテクチャを設計する**
   API、データストア、AWS・GCPのクラウド構成を組み合わせ、バックエンドとフロントエンドを含むシステムを設計・実装します。
3. **チームと運用へ落とし込む**
   開発チームのマネジメントと、CI/CDによるデプロイ自動化まで担当します。

### About

> CTO、PM、テックリード、開発者として、複数のWebサービスに関わってきました。GoやTypeScriptによるアプリケーション開発、AWS・GCP上のアーキテクチャ設計、CI/CDとチーム運営を横断し、事業条件に合わせて実装と運用を組み立てることを大切にしています。

### Contact

> プロジェクトや技術的な相談については、GitHubからご連絡ください。

## About

次の事実は移行する。

- CTO、PM、テックリード、開発者としての経験
- バックエンド、フロントエンド、クラウドを横断した経験
- システム設計、実装、チームマネジメントを担当してきたこと

次の表現は本人確認後に確定する。

- 現在関心のある領域
- 今後担いたい役割
- プロダクトや組織へ関わる姿勢の最終文言

「最新技術を常に追求」「エキスパート」「豊富な実績」など根拠が曖昧な自己評価は、そのまま移行せず、具体的な経験や行動が伝わる文章へ置き換える。

## 初期リリースの仮決定

| 項目 | 仮決定 | 確定タイミング |
| --- | --- | --- |
| 言語 | 日本語のみ | 英語対応は初期リリース後 |
| 既定テーマ | Dark | 基本UIレビュー時に本人確認 |
| Contact | GitHubのみ | 公開用連絡手段の確認後に追加 |
| Canvas素材 | YK SVG | 本人が写真を選んだ場合は差し替え |
| Selected Work | 上記4件 | コンテンツレビュー時に本人確認 |

## Issue #4へ引き継ぐコンテンツ契約

管理用TODOを公開UIの文字列として扱わない。未確認の本文は`undefined`または空配列とし、UIでは非表示にする。

```ts
type VerificationStatus = "verified" | "provisional" | "withheld" | "pending"
type PublicationStatus = "approved" | "blocked" | "pending"

type WorkCandidate<T> = {
  value: T
  sourceRefs: string[]
}

type WorkField<T> = {
  value?: T
  candidates?: WorkCandidate<T>[]
  verificationStatus: VerificationStatus
  sourceRefs: string[]
}

type Work = {
  id: string
  title: WorkField<string>
  role: WorkField<string>
  summary: WorkField<string>
  context: WorkField<string>
  challenge: WorkField<string>
  decisions: WorkField<string[]>
  outcomes: WorkField<string[]>
  technologies: WorkField<string[]>
  publicationStatus: PublicationStatus
}
```

- 仮文言にはフィールド単位で`verificationStatus: "provisional"`を付ける
- 未確認のChallenge、Decisions、Outcomeは`value`を省略し、`verificationStatus: "pending"`とする
- 原典が異なるStackは、本人確認まで`candidates`へ値と`sourceRefs`の組で保持し、自動統合しない
- 候補の確認後にだけ正式な`value`を設定し、フィールドの`sourceRefs`へ採用根拠を残す
- `publicationStatus: "approved"`でない案件は本番表示しない
- Issue #6で、未承認データが本番表示対象に含まれないことをテストする
- Issue #7の公開前に、表示対象の案件、Contact、Canvas素材がすべて承認済みであることを確認する

## 本人確認TODO

| 確認事項 | owner issue | 必要時点 | 未回答時のfallback | 公開阻害 |
| --- | --- | --- | --- | --- |
| Heroの最終メッセージ | #4 | PR完了 | `provisional`文言 | いいえ |
| 英字氏名と役割表記 | #4 | PR完了 | 日本語氏名と`ykoba`のみ | いいえ |
| Canvas素材 | #5 | PR完了 | 自作YK SVG | いいえ |
| Selected Work 4件の本番公開承認 | #4 | PR完了 | 未承認案件を非表示 | はい |
| 各案件のChallenge、Decisions、Outcome | #4 | PR完了 | 未確認項目を非表示 | はい |
| 現在関心のある領域 | #4 | PR完了 | Aboutから該当文を省略 | いいえ |
| Contactの連絡手段 | #4 | PR完了 | GitHubのみ | いいえ |
| Facebookリンク | #4 | PR完了 | 削除 | いいえ |
| `Tokyo, Japan`の掲載 | #4 | PR完了 | 所在地を非表示 | いいえ |
| Darkテーマを既定にするか | #3 | PR完了 | Dark | いいえ |
| 写真の本人性・権利・背景公開可否 | #5 | PR完了 | 写真を使用しない | いいえ |
| 公開済みスライド2ファイルの削除 | #8 | Hugo撤去時 | React版へ移行せず削除 | いいえ |

決定は該当Issueのコメントまたはコミットで記録する。`公開阻害: はい`が未解決の場合、Issue #7のデプロイを開始しない。

## Issue間のゲート

| ゲート | 条件 |
| --- | --- |
| Issue #3開始 | 現行ベースライン、`/profile/` base、Hugo維持方針が記録済み |
| Issue #4開始 | 4案件候補、空欄を許容する型、表示可能な仮文言が記録済み |
| Issue #4完了 | 少なくとも3案件の本番公開と表示用本文が承認済み。4件目だけは未承認の場合に非表示可 |
| Issue #7開始 | 表示対象の案件、Contact、Canvas素材に`blocked`または`pending`がない |
| Issue #8完了 | 公開資産台帳の全項目が`migrated`、`replaced`、`deleted`のいずれかになっている |
