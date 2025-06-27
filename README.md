# 리뉴올 스프린트 미션

## 다시 처음부터 해보자고 생각

## Express -> Hono

뭔가 다른 프레임워크를 써보자고 생각했습니다.

Fastify 와 Hono 를 비교했습니다.

| fastify | hono |
| :------ | :--- |
|         |      |

## 엔드포인트 개선

```mermaid

```

## ERD

```mermaid
erDiagram

  User ||--o{ Product : has
  User ||--o{ Article : has
  User ||--o{ ProductComment : writes
  User ||--o{ ArticleComment : writes
  User ||--o{ ProductLike : likes
  User ||--o{ ArticleLike : likes
  User ||--o{ CommentLike : likes
  User ||--o{ RefreshToken : has
  User ||--|| Image : has

  Product ||--o{ ProductComment : has
  Product ||--o{ ProductLike : has
  Product ||--o{ ProductImageLink : has
  Product ||--o{ ProductTag : taggedWith
  ProductImageLink ||--|| Image : linksTo
  Product ||--|| User : belongsTo

  Article ||--o{ ArticleComment : has
  Article ||--o{ ArticleLike : has
  Article ||--o{ ArticleImageLink : has
  Article ||--o{ ArticleTag : taggedWith
  ArticleImageLink ||--|| Image : linksTo
  Article ||--|| User : belongsTo

  ProductComment ||--o{ CommentLike : likedBy
  ProductComment ||--|| Product : belongsTo
  ProductComment ||--|| User : writtenBy

  ArticleComment ||--o{ CommentLike : likedBy
  ArticleComment ||--|| Article : belongsTo
  ArticleComment ||--|| User : writtenBy

  ProductLike ||--|| Product : likes
  ProductLike ||--|| User : byUser

  ArticleLike ||--|| Article : likes
  ArticleLike ||--|| User : byUser

  CommentLike ||--|| User : byUser
  CommentLike }o--|| ProductComment : onProductComment
  CommentLike }o--|| ArticleComment : onArticleComment

  ProductTag ||--o{ Product : tags
  ArticleTag ||--o{ Article : tags

  RefreshToken ||--|| User : forUser

  Log {
    String id
    String ip
    String url
    String method
    String statusCode
    String message
    DateTime createdAt
  }
```

## Redis

accessToken 블랙리스트 기능 적용
