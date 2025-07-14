-- # 초급 문제

-- 1. `orders` 테이블에서 모든 주문을 조회하세요.

SELECT * FROM orders; -- default
SELECT orders.* FROM orders; -- with table name
SELECT o.* FROM orders AS o; -- with table alias
SELECT o.* FROM orders o; -- with table alias without 'AS'

/*
  기능적, 성능적으로는 모두 동일하다.
  
  다만, JOIN 할 때 column 이름 충돌을 피하기 
  위해서는 명시적으로 table name과 같이 쓰는게 좋다.

  SELECT * 는 불필요한 column 까지 조회하기 때문에
  명시적으로 사용할 column 만 선택하는 것이 좋다.
*/

-- 2. `orders`테이블에서 `id` 가 `423`인 주문을 조회하세요.

SELECT orders.* 
FROM orders
WHERE orders.id = 423
;

-- 3. `orders` 테이블에서 총 주문 건수를 `total_orders`라는 이름으로 구하세요.

SELECT COUNT(*) AS total_orders
FROM orders 
;

-- 4. `orders` 테이블에서 최신 순으로 주문을 조회하세요. 
-- (`date`, `time` 컬럼이 분리되어 있다는 점에 주의)

SELECT orders.* 
FROM orders
ORDER BY orders.date DESC, orders.time DESC
;

/*
  이응(ㅇ)-에이(A) 조합으로 기억할 것!

  [ 오래된 순 - 오름차순 - ASC ]
*/

-- 5. `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다.
-- 페이지 크기가 10이고 최신순일 때, 첫 번째 페이지를 조회하세요.

SELECT orders.* 
FROM orders
ORDER BY orders.date DESC, orders.time DESC
OFFSET 0
LIMIT 10
;

/*
  데이터가 수만건 이상이 될 경우  OFFSET 은 성능 저하가 발생할 수 있다.

  첫번째 페이지만 가져오는 것이라면, keyset pagination(WHERE + ORDER BY + LIMIT)
  방식도 쓸 수 있다.
*/

SELECT orders.* 
FROM orders
WHERE (orders.date + orders.time) <= NOW()
ORDER BY orders.date DESC, orders.time DESC
LIMIT 10
;

-- 6. `orders` 테이블에서 오프셋 기반 페이지네이션된 목록을 조회합니다.
-- 페이지 크기가 10이고 최신순일 때 5번째 페이지를 조회하세요.

SELECT orders.* 
FROM orders
ORDER BY orders.date DESC, orders.time DESC
OFFSET (5 - 1) * 10
LIMIT 10
;

/*
  정확한 페이지 탐색엔 느리더라도 OFFSET 이 적절하다.
*/

-- 7. `orders` 테이블에서 커서 페이지네이션된 목록을 조회합니다.
-- 페이지 크기가 10이고 최신순일때, `id` 값을 기준으로 커서를 사용합시다.
-- 커서의 값이 `42`일 때 다음 페이지를 조회하세요.

SELECT orders.* 
FROM orders
WHERE orders.id < 42
ORDER BY orders.id DESC
LIMIT 10
;

/*
  [ <, > ] 에 따라 방향이 바뀐다.
  ASC 냐 DESC 냐에 따라 비교 연산자의 의미가 바뀐다는 것을 명심할 것.
*/

-- 8. `orders` 테이블에서 2025년 3월에 주문된 내역만 조회하세요.

SELECT orders.*
FROM orders
WHERE orders.date >= '2025-03-01' AND orders.date < '2025-04-01'
;

/*
  JSON 으로 내보내는 함수를 제공한다!
  aggrregate(집계)의 약자 agg 가 붙는다.
*/

SELECT json_agg(t)
FROM (
  SELECT orders.*
  FROM orders
  WHERE date >= '2025-03-01' AND date < '2025-04-01'
) AS t
;

/*
  하지만, CSV 로 내보내는 내장 함수는 없다.
  CSV 로 내보낼 때엔 별도의 문자열로 만들어서 내보내야 한다.
*/

SELECT string_agg(t.id || ',' || t.date || ',' || t.time, E'\n')
FROM (
  SELECT orders.*
  FROM orders
  WHERE date >= '2025-03-01' AND date < '2025-04-01'
) AS t
;

-- 9. `orders` 테이블에서 2025년 3월 12일 오전에 주문된 내역만 조회하세요.

SELECT orders.*
FROM orders
WHERE orders.date = '2025-03-12' AND orders.time < '12:00:00'
;

-- 10. `pizza_types` 테이블에서 이름에 
-- 'Cheese' 혹은 'Chicken'이 포함된 피자 종류를 조회하세요.
-- (대소문자를 구분합니다)

SELECT pt.*
FROM pizza_types AS pt
WHERE pt.name LIKE '%Cheese%' OR pt.name LIKE '%Chicken%'
;

-- # 중급 문제

-- 1. `order_details` 테이블에서 각 피자(`pizza_id`)별로
-- 주문된 건 수(`order_id`)를 보여주세요.

SELECT od.pizza_id, COUNT(od.order_id) AS total_order_count
FROM order_details AS od
GROUP BY od.pizza_id
;

/*
  결과값이 잘 나와서 그냥 넘어가려다가 문득,
  생각해보니 이 [주문된 건 수라는 표현이 명확하지 않을 수도 있다] 는 것을 깨달았다.

  왜냐면 제공된 order_details 의 데이터에는 quantity 가 있는데, 
  하나의 주문에 여러 quantity 가 있을 수 있었다.

  물론, 문제에 order_id 를 명시하고 있긴 있는데, 
  실제로 저 요청을 하는 사람이 '피자별로 얼마나 팔렸는지' 궁금한 거라면
  SUM 를 같이 줘야 한다고 생각했다.
*/

SELECT od.pizza_id,
	COUNT(od.order_id) AS total_order_count,
    SUM(od.quantity) AS total_quantity_ordered
FROM order_details AS od
GROUP BY od.pizza_id
;

-- 2. `order_details` 테이블에서 각 피자(`pizza_id`)별로 총 주문 수량을 구하세요.

SELECT 
    od.pizza_id, 
    SUM(od.quantity) AS total_quantity
FROM order_details AS od
GROUP BY od.pizza_id
;


-- 3. `pizzas` 테이블에서 `price`의 크기가 20보다 큰 피자의 종류만
-- `order_details` 테이블에서 조회하세요. (힌트: 서브쿼리)

SELECT od.*
FROM order_details AS od
WHERE od.pizza_id IN (
  SELECT id
  FROM pizzas AS p
  WHERE p.price > 20
);

/*
  목록 자체는 잘 가져왔지만, 피자 가격도 궁금해 할 가능성이 높다.

  pizzas 의 가격을 같이 보이기 위해서 JOIN 으로 가져오는 방법도 사용해보았다.

  개인적으로는 JOIN 이 더 편하다.
*/

SELECT od.*, p.price
FROM order_details AS od
    JOIN pizzas AS p  
    ON od.pizza_id = p.id
WHERE p.price > 20;

-- 4. `orders` 테이블에서
-- 각 날짜별 총 주문 건수를 `order_count` 라는 이름으로 계산하고, 
-- 하루 총 주문 건수가 80건 이상인 날짜만 조회한 뒤,
-- 주문 건수가 많은 순서대로 정렬하세요.

SELECT orders.date, COUNT(*) AS order_count
FROM orders
GROUP BY orders.date
HAVING COUNT(*) >= 80
ORDER BY order_count DESC
;

-- 5. `order_details` 테이블에서 
-- 피자별(`pizza_id`) 총 주문 수량이 10개 이상인 피자만 조회하고,
-- 총 주문 수량 기준으로 내림차순 정렬하세요.

SELECT od.pizza_id, SUM(od.quantity) AS total_quantity
FROM order_details AS od
GROUP BY od.pizza_id
HAVING SUM(od.quantity) >= 10
ORDER BY total_quantity DESC
;

-- 6. `order_details` 테이블에서 
-- 피자별 총 수익을 `total_revenue` 라는 이름으로 구하세요.
-- (수익 = `quantity * price`)

SELECT 
  od.pizza_id,
  SUM(od.quantity) AS total_quantity,
  p.price,
  ROUND(SUM(od.quantity * p.price)::numeric, 2) AS total_revenue
FROM order_details AS od
    JOIN pizzas AS p 
    ON od.pizza_id = p.id
GROUP BY od.pizza_id, p.price
;

/*
  SUM(od.quantity * p.price) 이 실수인지 명확하게 확정지어줘야
  ROUND 를 사용할 수 있었다.
*/

-- 7. 날짜별로 피자 주문 건수(`order_count`)와 총 주문 수량(`total_quantity`)을 구하세요.

SELECT 
	orders.date,
	COUNT(orders.id) AS order_count,
	SUM(od.quantity) AS total_quantity
FROM order_details AS od
	JOIN orders
	ON od.order_id = orders.id
GROUP BY orders.date
;

-- # 고급 문제

/*
    1. 피자별(`pizzas.id` 기준) 판매 수량 순위에서 피자별 판매 수량 상위에 드는 베스트 피자를 10개를 조회해 주세요. `pizzas`의 모든 컬럼을 조회하면서 각 피자에 해당하는 판매량을 `total_quantity`라는 이름으로 함께 조회합니다.
        
        출력 예시:

        ```sql
            big_meat_s    | big_meat    | S    |    12 |           1914
            thai_ckn_l    | thai_ckn    | L    | 20.75 |           1410
            five_cheese_l | five_cheese | L    |  18.5 |           1409
            four_cheese_l | four_cheese | L    | 17.95 |           1316
            classic_dlx_m | classic_dlx | M    |    16 |           1181
            spicy_ital_l  | spicy_ital  | L    | 20.75 |           1109
            hawaiian_s    | hawaiian    | S    |  10.5 |           1020
            southw_ckn_l  | southw_ckn  | L    | 20.75 |           1016
            bbq_ckn_l     | bbq_ckn     | L    | 20.75 |            992
            bbq_ckn_m     | bbq_ckn     | M    | 16.75 |            956
        ```
*/

SELECT 
	p.*,
	SUM(od.quantity) AS total_quantity
FROM pizzas AS p
	JOIN order_details AS od
	ON p.id = od.pizza_id
	JOIN orders AS o
	ON od.order_id = o.id
GROUP BY 
	p.id, 
	p.type_id,
	p.size,
	p.price
ORDER BY total_quantity DESC
LIMIT 10
;

/*
    2. `orders` 테이블에서 2025년 3월의 일별 주문 수량을 `total_orders`라는 이름으로, 일별 총 주문 금액을 `total_amount`라는 이름으로 포함해서 조회하세요.
        
        출력 예시:
        
        ```sql
        2025-03-01 |           99 | 1598.5500011444092
        2025-03-02 |          138 |  2379.050001144409
        2025-03-03 |          133 | 2287.8999996185303
        2025-03-04 |          144 |  2444.300001144409
        2025-03-05 |          140 |  2350.650005340576
        ```
*/

SELECT 
  o.date,
  COUNT(o.id) AS order_count,
  ROUND(SUM(od.quantity * p.price)::numeric, 2) AS total_amount
FROM orders AS o
	JOIN order_details AS od
	ON od.order_id = o.id
	JOIN pizzas AS p 
	ON od.pizza_id = p.id
WHERE o.date >= '2025-03-01' AND o.date < '2025-04-01'
GROUP BY o.date
ORDER BY o.date ASC
;

/*
    3. `order`의 `id`가 78에 해당하는 주문 내역들을 조회합니다. 주문 내역에서 각각 주문한 피자의 이름을 `pizza_name`, 피자의 크기를 `pizza_size`, 피자 가격을 `pizza_price`, 수량을 `quantity`, 각 주문 내역의 총 금액을 `total_amount` 라는 이름으로 조회해 주세요.
        
        출력 예시:
        
        ```sql
        The Thai Chicken Pizza      | S          |       12.75 |        1 |              12.75
        The Big Meat Pizza          | S          |          12 |        1 |                 12
        The Classic Deluxe Pizza    | S          |          12 |        1 |                 12
        The Italian Capocollo Pizza | M          |          16 |        1 |                 16
        The Spicy Italian Pizza     | L          |       20.75 |        3 |              62.25
        The Four Cheese Pizza       | L          |       17.95 |        1 | 17.950000762939453
        ```
*/

SELECT 
	pt.name AS pizza_name,
	p.size AS pizza_size,
	p.price AS pizza_price,
	SUM(od.quantity) AS pizza_quantity,
	ROUND(SUM(od.quantity * p.price)::numeric, 2) AS total_amount
FROM orders AS o
	JOIN order_details AS od
	ON o.id = od.order_id
	JOIN pizzas AS p
	ON od.pizza_id = p.id
	JOIN pizza_types AS pt
	ON p.type_id = pt.id
WHERE o.id = 78
GROUP BY 
    pt.name, 
    p.size, 
    p.price
ORDER BY pizza_name ASC
;

-- 추가적으로 pizza_name 을 기준으로 정렬했다.

/*    
    4. `order_details`와 `pizzas` 테이블을 JOIN해서 피자 크기별(S, M, L) 총 수익을 계산하고, 크기별 수익을 출력하세요.
        
        출력 예시:
        
        ```sql
        L    |  375318.7010040283
        M    |          249382.25
        S    | 178076.49981307983
        XL   |              14076
        XXL  | 1006.6000213623047
        ```
*/

SELECT 
	p.size,
	ROUND(SUM(od.quantity * p.price)::numeric, 2) AS total_amount
FROM order_details AS od
	JOIN pizzas AS p
	ON od.pizza_id = p.id
GROUP BY 
	p.size
ORDER BY
	p.size
;

/*    
    5. `order_details`, `pizzas`, `pizza_types` 테이블을 JOIN해서 각 피자 종류의 총 수익을 계산하고, 수익이 높은 순서대로 출력하세요.
        
        출력 예시:
        
        ```sql
        The Thai Chicken Pizza                     |           43434.25
        The Barbecue Chicken Pizza                 |              42768
        The California Chicken Pizza               |            41409.5
        The Classic Deluxe Pizza                   |            38180.5
        The Spicy Italian Pizza                    |           34831.25
        The Southwest Chicken Pizza                |           34705.75
        The Italian Supreme Pizza                  |           33476.75
        ```
*/

SELECT 
	pt.name,
	ROUND(SUM(od.quantity * p.price)::numeric, 2) AS total_amount
FROM order_details AS od
	JOIN pizzas AS p
	ON p.id = od.pizza_id
	JOIN pizza_types AS pt
	ON pt.id = p.type_id
GROUP BY pt.name
ORDER BY total_amount DESC
;