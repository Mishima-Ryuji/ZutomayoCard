# Zuztomayo Card Wiki README

本リポジトリは、[Zutomayo Card Wiki](https://zutomayo-card.com/)を管理している OSS のリポジトリです。協力者を募集中です。意見やアイディアなどは Issue に作成してもらえればと思います。なお、本プロジェクトは有志で集まって管理しているため、レビューや開発の催促は原則禁止とさせて頂きます。皆さんが楽しみながら開発をできることを最優先にして活動しています。

## 利用技術

- Firebase
- Next.js (React)
- Chakra UI

## 環境構築

以下のコマンドを実行後、[localhost:3000](http://localhost:3000/) を起動してください。

```
git clone https://github.com/Mishima-Ryuji/ZutomayoCard.git
cd ZutomayoCard
yarn install
yarn dev
```

## Issue の運用

アイディアや不具合報告、新機能リクエスト、改善リクエストは Issue にしてください。管理者が Issue に対する対処法を決定いたします。なお、管理者が Issue を理解しやすいようにテンプレートに従って具体的かつわかりやすく記述するように心がけてください。

## Pull request の運用

Pull request はテンプレートに従って記述してください。レビュワーはこのリポジトリの管理者に設定してください。すべての GitHub Actions が通ることを確認してください。

## ブランチ運用

ブランチは main から切って main に PR を出してください。Issue が消化される時期は未定なので、PR 単位でリリースしていく方針です。

## Firebase のアクセスについて

基本的に管理者以外は、Firebase のコンソールにはアクセスできないようにします（権限の変更や個人情報の流出を防ぐため）。Firebase にデプロイする権限が必要な場合や Firebase 関連の rules を編集する必要がある場合、管理者のテストをしたい場合は、変更後の rules を @Mishima-Ryuji に連絡してもらってください。

## 開発上の注意点

本プロジェクトの開発には VS Code の利用を推奨しております。VS Code のこのワークスペースおすすめの拡張機能を導入してください。Prettier や ESLint の設定ができていないと、GitHub Actions が通らないようになっております。

また、本リポジトリは Cloud Functions のコードと Next.js のコードを共通化してモノレポで運用しています。Cloud Functions のコードで使う Firebase の SDK と Next.js で使う Firebase の SDK は種類が違いますが、共通化できるようにそれぞれの SDK 用のエイリアスを作成して共通化しています。そのため、Firebase の関数等を使うときは、firebase/firestore などから export されている関数を使うのではなく、~/firebase からエクスポートされている関数を使用してください。

また、同じ Issue を複数人で取り組まないようにするために、Issue を開始したら自分をアサインしてください。

## 禁止行為

以下の行為は禁止行為とさせて頂きます。

- このリポジトリを複製またはフォークして、インターネット上に公開すること
- 本プロジェクトに紐づくデータを勝手に変更したり、削除したりすること。

## 連絡先等

開発に関することは基本的に GitHub 上のコミュニケーションでお願いします。また、Firebase 等の管理をしたいかたや運営と密に関わりたい方は、Discord サーバーに参加してください。Discord サーバーに参加する方法は、[こちら](https://zutomayo-card.com/about)をご参照ください。
