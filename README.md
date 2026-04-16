# Digimon TCG Battle Tracker

デジモンカードゲーム戦績管理アプリ

## デプロイ手順（Vercel）

### 1. GitHubにリポジトリを作成
1. https://github.com にアクセスしてサインイン
2. 右上の「＋」→「New repository」
3. Repository name: `digimon-tcg-manager`
4. Public または Private を選択
5. 「Create repository」をクリック

### 2. ファイルをアップロード
1. 作成したリポジトリのページで「uploading an existing file」をクリック
2. このフォルダの中身をすべてドラッグ＆ドロップ
   - `.gitignore`
   - `index.html`
   - `package.json`
   - `vite.config.js`
   - `src/` フォルダ（`main.jsx` と `App.jsx` を含む）
3. 「Commit changes」をクリック

### 3. Vercelでデプロイ
1. https://vercel.com にアクセス
2. 「Sign Up」→「Continue with GitHub」でサインイン
3. 「Add New Project」→ GitHubのリポジトリを選択
4. Framework Preset: **Vite** を選択（自動検出されるはず）
5. 「Deploy」をクリック
6. 数分後にURLが発行される（例: `digimon-tcg-manager.vercel.app`）

### 4. スマホのホーム画面に追加
- iPhone: Safariで開いて「共有」→「ホーム画面に追加」
- Android: Chromeで開いて「⋮」→「ホーム画面に追加」

## アプリの更新方法
App.jsx を更新してGitHubにアップロードすると、Vercelが自動的に再デプロイします。
