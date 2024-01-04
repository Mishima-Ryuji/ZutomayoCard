# 1. nodejs,java を用意

エミュレータの関係で以下に示したバージョン通りでインストールされていることを確認してください。
参考:https://firebase.google.com/docs/emulator-suite/install_and_configure?hl=ja#install_the_local_emulator_suite

```
node --version # Nodejs 16 (16のみ)
java --version # JDK Version 11 以上
```

# 2. firebase cli を global install

```
yarn global add firebase

firebase --version
```

# 3. emulator を起動

```
firebase emulators:start
```

- Error: Failed to get Firebase project zutomayo-33d04. Please make sure the project exists and your account has permission to access it.
  のようなエラーが表示される場合は以下コマンドででログインし直してください

  ```
  firebase logout
  firebase login
  ```

参考: https://iwb.jp/firebase-account-returns-error-not-login-long-time/

# エミュレータ起動後 localhost:4000 にアクセスしてください。
