# real_time_voting_system


## 環境構築


```shell script
git clone https://github.com/ToyoshimaHidenori/real_time_voting_system.git
```

```shell script
cd ./real_time_voting_system
```

Dockerを事前にインストールする必要があります。以下のコマンドでビルドします。

```shell script
docker-compose build
```

以下のコマンドで、 ~開発環境上でのシェルが~ アプリケーションが起動します。
```shell script
docker-compose run --service-ports --rm app
```
ここで、ブラウザから投票者画面```localhost:7000/```または管理者画面```localhost:7000/admin/```にアクセスできます。


## 起動方法
直下のディレクトリで以下のコマンドを実行
```node app```

ブラウザを立ち上げて、投票者は、
localhost:7000,　管理者兼発表者は、
localhost:7000/admin
にアクセス。

## 使用の流れ
- はじめに、投票者は団体名と、配布された団体番号を入力。

- 発表者が、被投票者名を送信すると、自動的に投票が始まる。

- 投票者は、投票を行い送信すると、承認、否認が決定した時点でそれを表示。

- 発表者が、次の被投票者名を送信すると、自動的に次の投票に移る。
