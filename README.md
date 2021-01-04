# Node Project (v1.0)

## Global environment

- nodemon (mandatory) - node 실행 application fro development
- [mongodb](https://github.com/mongodb/homebrew-brew) (mandatory) - mongo 데이터베이스

```shell
$ npm i -g nodemon
$ brew tap mongodb/brew
$ brew install mongodb-community
```

## NPM scripts
  >```
  > local: local에서 개발용으로 서버 run
  > lint: lint test
  > route:add <name>: route 추가, db model, controller, api 추가 생성한다. (run 후 routes/api/v1/index.js 에 route 추가)
  > route:remove <name>: route 제거, db model, controller, api 제거한다.
  >```


## Default Route, V1

### Authentication
- POST /signup
- POST /signin
- POST /sso

### Verify
- POST /verify

### User
- RUD /user

### File
- CRUD /file #multer module 사용, multipart 제공, aws s3 와 연동