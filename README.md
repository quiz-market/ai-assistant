# AI Assistant

## セットアップ手順

### Scheduler

#### Google Calendar API の認証情報の設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセスし、プロジェクトを作成または選択します。
2. 左側のメニューから「API とサービス」→「認証情報」を選択します。
3. 「認証情報を作成」→「OAuth クライアント ID」を選択します。
4. アプリケーションの種類として「デスクトップアプリ」を選択し、任意の名前を入力して作成します。
5. 作成された認証情報をダウンロードし、`scheduler/credential.json`という名前で保存します。
6. `node ./scheduler/setup-token.js`コマンドを実行します。実行時にブラウザが開いて Google 認証画面が表示されます。認証を完了すると、自動的に`scheduler/token.json`が生成されます。


