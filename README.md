# ReceiptMailPDFer

CSVインプットとデータベース検索を通じて、パーソナライズされたPDF領収書を自動的に生成し、メールで送信するシステムです。

## プロジェクト概要

このプロジェクトは、CSVファイルに含まれるユーザーのメールアドレスに基づいて、該当ユーザーの購入履歴をデータベースから検索し、領収書をPDFで生成して、メールで送信するウェブアプリケーションです。

## 主な機能

- CSVファイルのアップロード（ドラッグ＆ドロップ対応）
- 領収書メールテンプレートの選択
- ユーザー別カスタムPDF領収書の生成
- SendGridを通じた大量メール配信
- トランザクションベースのデータ処理
- 失敗時の自動再試行メカニズム

## 技術スタック

### フロントエンド
- Next.js
- TypeScript
- Styled-Components
- React

### バックエンド
- Node.js
- Express
- TypeScript
- Sequelize (MySQL ORM)
- Puppeteer (PDF生成)
- SendGrid API (メール送信)

### インフラ
- Docker
- MySQL

## プロジェクト実行方法

### 前提条件
- Dockerのインストール
- SendGrid APIキー

### 環境設定

1. バックエンド環境変数設定（`backend/.env`ファイル作成）
```
PORT=8080
DB_HOST=db
DB_USER=user
DB_PASS=password
DB_NAME=receiptdb
SENDGRID_API_KEY=your_sendgrid_api_key
```

2. フロントエンド環境変数設定（`frontend/.env`ファイル作成）
```
NEXT_PUBLIC_BACKEND_ENDPOINT=http://localhost:8080
NEXT_PUBLIC_API_KEY=your_api_key
NEXT_PUBLIC_API_KEY_V2=your_api_key_v2
```

### Dockerでの実行方法

1. プロジェクトのクローン
```bash
git clone https://github.com/honggipyo/ReceiptMailPDFer.git
cd ReceiptMailPDFer
```

2. Docker Composeでアプリケーションを実行
```bash
# コンテナのビルドと実行
docker-compose up --build

# 実行中のコンテナを確認
docker ps

# バックグラウンドですべてのサービスを実行
docker-compose up -d

# ログの確認（オプション）
docker-compose logs -f
```

3. ブラウザでアクセス
```
http://localhost:3000
```

### 初期データベース設定

アプリケーション初回実行時に必要なデータベースマイグレーション：

```bash
# バックエンドコンテナにアクセス
docker exec -it receiptmailpdfer-backend-1 /bin/sh

# データベースマイグレーションの実行
npx sequelize-cli db:migrate
```

### Dockerコンテナ管理

```bash
# すべてのサービスを停止
docker-compose stop

# すべてのサービスを停止しコンテナを削除
docker-compose down

# すべてのサービスを停止し、コンテナとボリュームを削除（データベース初期化）
docker-compose down -v

# 特定のサービスのみ再起動（例：バックエンド）
docker-compose restart backend
```

## 使用方法

1. ウェブインターフェースでメールテンプレートを選択（「領収書メール送信」）
2. CSVファイルをアップロード（ドラッグ＆ドロップまたはファイル選択）
3. サンプルCSV形式を参考にファイルを準備
4. 「領収書発行メール送信に同意します」をチェック
5. 「領収書発行メールを一括で送信」ボタンをクリック

### CSVファイル形式
```
email
user1@example.com
user2@example.com
user3@example.com
```

## データベース構造

システムは次のようなテーブルを使用します：
- Users: ユーザー情報（メール、名前など）
- Products: 商品情報（名前、価格など）
- Purchases: 購入情報（ユーザーID、商品ID、数量など）


## プロジェクト構造

```
ReceiptMailPDFer/
├── backend/                  # バックエンドアプリケーション
│   ├── src/                  # ソースコード
│   │   ├── constants/        # 定数定義
│   │   ├── controller/       # コントローラー（リクエスト処理）
│   │   ├── entity/           # エンティティ定義
│   │   ├── gateways/         # データアクセスゲートウェイ
│   │   ├── helpers/          # ユーティリティ関数
│   │   ├── models/           # データベースモデル
│   │   ├── service/          # ビジネスロジックサービス
│   │   ├── testing/          # テストコード
│   │   ├── types/            # 型定義
│   │   ├── usecase/          # ユースケース（ビジネスロジック）
│   │   └── index.ts          # アプリケーションエントリーポイント
│   ├── testing/              # テストコード
│   ├── package.json          # パッケージ定義
│   ├── tsconfig.json         # TypeScript設定
│   └── Dockerfile            # バックエンドDockerイメージ定義
├── frontend/                 # フロントエンドアプリケーション
│   ├── src/                  # ソースコード
│   │   ├── components/       # Reactコンポーネント
│   │   ├── constants/        # 定数定義
│   │   ├── pages/            # Next.jsページコンポーネント
│   │   ├── styles/           # スタイル定義
│   │   └── util/             # ユーティリティ関数
│   ├── public/               # 静的ファイル
│   ├── package.json          # パッケージ定義
│   ├── tsconfig.json         # TypeScript設定
│   └── Dockerfile            # フロントエンドDockerイメージ定義
├── docker-compose.yml        # Docker Compose設定
└── README.md                 # プロジェクト文書
```
