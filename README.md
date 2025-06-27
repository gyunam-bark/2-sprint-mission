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

## redis

accessToken 블랙리스트 기능 적용
