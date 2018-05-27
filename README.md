# contents
- [contents](#contents)
- [Environment](#environment)
- [Getting Started](#getting-started)
- [Explain files](#explain-files)
  - [base.js](#basejs)
  - [crawl.js](#crawljs)
  - [gettitle.js](#gettitlejs)
  - [gethref.js](#gethrefjs)
  - [search.js](#searchjs)

# Environment
- node v8.9.0
- yarn or npm

# Getting Started
1. package.jsonのモジュールをダウンロード

```
yarn 

npm install
```

2. スクリプト起動

```
node ファイル名.js
```

# Explain files
## base.js
puppeteerのベース

## crawl.js
同一ドメインのサイトを回って処理をする

## gettitle.js
ページのエレメント取得の例としてtitleのtextを取得

## gethref.js
複数の要素の複数のプロパティを取得してjsonに排出

## search.js
検索結果項目１番目を表示