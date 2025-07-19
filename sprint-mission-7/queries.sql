/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users
SET nickname = 'test'
WHERE id = '00000000-0000-0000-0000-000000000001';

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT *
FROM products AS p
WHERE p.user_id = '00000000-0000-0000-0000-000000000001'
  AND p.deleted_at IS NULL
ORDER BY p.created_at DESC
LIMIT 10
OFFSET 2 * 10
;

/*
  3. 내가 생성한 상품의 총 개수
*/
SELECT COUNT(p.id)
FROM products AS p
WHERE p.user_id = '00000000-0000-0000-0000-000000000001'
	AND deleted_at IS NULL
;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT p.*
FROM product_likes AS pl
JOIN products AS p ON pl.product_id = p.id
WHERE pl.user_id = '00000000-0000-0000-0000-000000000001'
  AND p.deleted_at IS NULL
ORDER BY pl.created_at DESC
LIMIT 10 
OFFSET 2 * 10
;

/*
  5. 내가 좋아요 누른 상품의 총 개수
*/
SELECT COUNT(*) AS total_likes
FROM product_likes pl
JOIN products p ON pl.product_id = p.id
WHERE pl.user_id = '00000000-0000-0000-0000-000000000001'
  AND p.deleted_at IS NULL
;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/
INSERT INTO products (
  id,
  user_id,
  name,
  description,
  price,
  main_image_id
)
VALUES (
  uuid_generate_v4(),
  '00000000-0000-0000-0000-000000000001',
  'HP 포션',
  'Health Point 를 채워주는 포션입니다.',
  18000,
  '99999999-9999-9999-9999-000000000001'
);

/*
  7. 상품 목록 조회
  - "test" 로 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT
  p.id,
  p.name,
  p.description,
  p.price,
  p.created_at,
  u.nickname,
  COUNT(pl.user_id) AS like_count
FROM products p
  INNER JOIN users AS u 
  ON p.user_id = u.id
  LEFT JOIN product_likes AS pl 
  ON p.id = pl.product_id
WHERE u.nickname = 'test'
  AND p.deleted_at IS NULL
GROUP BY p.id, u.nickname
ORDER BY p.created_at DESC
LIMIT 10 
OFFSET 0
; 

/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT
  p.id,
  p.name,
  p.description,
  p.price,
  p.created_at,
  p.updated_at,
  u.nickname AS uploader_nickname,
  i.url AS main_image_url,
  COUNT(pl.user_id) AS like_count
FROM products p
  INNER JOIN users AS u 
  ON p.user_id = u.id
  LEFT JOIN images AS i 
  ON p.main_image_id = i.id
  LEFT JOIN product_likes AS pl 
  ON p.id = pl.product_id
WHERE p.id = '22222222-2222-2222-2222-000000000001'
  AND p.deleted_at IS NULL
GROUP BY p.id, u.nickname, i.url
;

/*
  9. 상품 수정
  - 1번 상품 수정
*/
UPDATE products
SET
  name = '린스',
  description = '단 한 올만 윤기가 흐르게 되는 마법의 린스입니다.',
  price = 15000,
  main_image_id = '99999999-9999-9999-9999-000000000001', 
  updated_at = NOW()
WHERE id = '11111111-1111-1111-1111-000000000001'
;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/
UPDATE products AS p
SET deleted_at = NOW()
WHERE p.id = '11111111-1111-1111-1111-000000000001'
;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/
INSERT INTO product_likes (user_id, product_id)
VALUES ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-000000000002')
ON CONFLICT DO NOTHING;

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/
DELETE FROM product_likes
WHERE user_id = '00000000-0000-0000-0000-000000000001'
  AND product_id = '11111111-1111-1111-1111-000000000002';


/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/
BEGIN;

WITH new_comment AS (
  INSERT INTO comments (id, user_id, content, target_type, target_id)
  VALUES (
    '33333333-3333-3333-3333-000000000021',
    '00000000-0000-0000-0000-000000000001',
    '꾸준히 썼더니 진짜 이빨이 없어져서 충치 걱정이 없어졌어요!',
    'product',
    '11111111-1111-1111-1111-000000000002'
  )
  RETURNING id
)
INSERT INTO product_comments (comment_id, product_id)
SELECT id, '11111111-1111-1111-1111-000000000002' FROM new_comment;

COMMIT;

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준으로 커서 페이지네이션
  - 10개씩 페이지네이션
*/
SELECT
  c.id AS comment_id,
  u.nickname,
  c.content,
  c.created_at
FROM comments c
JOIN users u ON c.user_id = u.id
WHERE c.target_type = 'product'
  AND c.target_id = '11111111-1111-1111-1111-000000000001'
  AND c.deleted_at IS NULL
  AND c.created_at < TIMESTAMP '2025-03-25 00:00:00'
ORDER BY c.created_at DESC
LIMIT 10;