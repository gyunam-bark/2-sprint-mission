# 변경점

## express.js -> hono.js

뭔가 다른 프레임워크를 써보자고 생각했습니다.

Fastify 와 Hono 를 비교했습니다.

| fastify | hono |
| :------ | :--- |
|         |      |

## 엔드포인트 개선

```mermaid

```

## erd 설계 변경

### 수정 목표 방향성

1. 모델 분리로 단일 외래키 구성 → 데이터 무결성 확보
   • 기존에는 CommentLike 모델 하나에서 productCommentId와 articleCommentId를 nullable 필드로 함께 관리.
   • 두 필드 중 하나만 존재해야 하는 구조였지만, 데이터 무결성에 문제가 발생할 가능성 존재함.
   • 따라서, 구조는 같지만 사용되는 위치가 다른 productComment와 articleComment에 대해 각각 전용 Like 모델을 분리.

### 수정된 erd

```mermaid

```

## prisma unique_id

```js
const unlikedProduct = await prisma.productLike.delete({
  where: {
    userId_productId: {
      userId,
      productId,
    },
  },
});
return unlikedProduct;
```

## superstruct -> joi

## 에러 처리 방법 변경

hono 공식 예제 코드를 보는데 생각보다 try-catch 가 없다는 것을 깨달음.

그리고 hono 는 자동으로 throw 된 error 가 있으면 동작하는 onError 내장 이벤트가 있었음.

기존 작성했던 코드는 가능한 모든 경우의 에러를 잡는 게 낫다고 생각해서, try-catch 를 모든 controller 와 service 에 넣고 일일이 throw 하고 있었음.

"내가 작성한 try-catch 의 대부분은 굳이 필요없는 것일 수도 있다." 라는 가설을 세움.

하나의 엔드포인트에서 controller 와 service 의 try-catch 를 모두 지워도 정상적으로 동작하는 것을 확인함.

### try-catch 동작 원리 학습

너무 무분별하게 try-catch 를 써왔던게 아닌가 하는 생각이 들어서, 먼저 try-catch 가 어떻게 동작하는 지 테스트를 진행함.

## redis

accessToken 블랙리스트 기능 적용
