# SPRINT6

## POSTGRESQL 연결

```bash
psql postgresql://postgres:password@localhost:5432
```

## PIZZA_PLACE 데이터베이스 생성

### 명령어

```bash
CREATE DATABASE pizza_place;
```

### 결과

```bash
CREATE DATABASE
```

## 접속 데이터베이스 PIZZA_PLACE 로 변경

이걸 깜빡하고 안 했더니, 기본 postgresql 데이터베이스에 후술할 pizze_place 데이터가 들어갔다..

```bash
\c pizza_place
```

## PIZZA 데이터 입력

```bash
\i seed/pizza_place_sales.sql
```

## PG_ADMIN 로그인

```text
http://localhost:8080/
```

## PIZZE_PLACE_SALES 테이블 확인

![rm-1](./resource/rm-1.png)

## SQL 학습

### SQL 은 영문법 순서를 따른다.

1970 년 대 IBM 이 만든 최초의 **구조화된 `영어` 질의\(요청\) 언어** 에서 파생되어 나왔기 때문.

> **SEQUEL** = **S**tructured **E**nglish **QUE**ry **L**anguage

예를들어, 아래와 같은 SQL 이 있다고 해보자.

```sql
SELECT name, age
FROM users
WHERE age > 30;
```

이건 영어 문장으로 작성하면 아래와 같이 적힌다.

```text
SELECT name and age FROM users WHERE age is greater than 30.
```

즉, 키워드의 순서가 헷갈릴 때엔 **영어 문법에 따라서** 순서를 작성하면 된다.

### 작성 순서 와 동작 순서

```mermaid
flowchart TB
    %% 왼쪽: SQL 실행 순서
    subgraph LOGIC [SQL 내부 실행 순서]
        direction TB
        E1[FROM]
        E2[JOIN]
        E3[WHERE]
        E4[GROUP BY]
        E5[HAVING]
        E6[WINDOW]
        E7[SELECT]
        E8[ORDER BY]
        E9[LIMIT / OFFSET]

        E1 --> E2 --> E3 --> E4 --> E5 --> E6 --> E7 --> E8 --> E9
    end

    %% 오른쪽: SQL 작성 순서
    subgraph SYNTAX [SQL 작성 순서]
        direction TB
        S1[SELECT]
        S2[FROM]
        S3[JOIN]
        S4[WHERE]
        S5[GROUP BY]
        S6[HAVING]
        S7[WINDOW]
        S8[ORDER BY]
        S9[LIMIT / OFFSET]

        S1 --> S2 --> S3 --> S4 --> S5 --> S6 --> S7 --> S8 --> S9
    end
```

### POSTGRESQL 인코딩 기본값은 UTF-8

```sql
show client_encoding; -- postgresql client 인코딩 확인
show server_encoing; -- postgresql server 인코딩 확인
```

### JSON 으로 내보내기

JSON 으로 내보내는 함수를 제공한다!
aggrregate(집계)의 약자 agg 가 붙는다.

```sql
SELECT json_agg(t)
FROM (
  -- SUB_QUERY
) AS t;
```

### CSV 로 내보내기

```sql
SELECT string_agg(t.hello || ',' || t.world, E'\n')
FROM (
 -- SUB_QUERY
) AS t;

```

### 명시적 타입 변화

중급 문제 6번에서 맞닿뜨렸던 상황.

피자 가격이 소수였기 때문에, 계산된 결과도 소수인데 소숫점이 너무 길었다.

줄이려고 단순하게 ROUND 를 적용하려 했더니 에러가 발생했고, 원인을 확인해보니 계산 결과가 확실하게 소수인 것을 지정해줘야 했다.

**방법 1: numeric 캐스팅**

```sql
ROUND(SUM(a * b)::numeric, 2)
```

**방법 2: CAST(..AS numeric)**

```sql
ROUND(CAST(SUM(a * b) AS numeric), 2)
```

방법 2가 더 정확하다고 하는데, 그만큼 약간 더 연산 성능이 낮다고 한다.

단순히 피자 가격 계산이기 때문에 `::numeric` 캐스팅 으로 처리했다.

### JOIN

| 종류       | 설명                       | 예시                                              |
| :--------- | :------------------------- | :------------------------------------------------ |
| INNER JOIN | 두 테이블에 공통된 데이터  | 빵을 산 고객만 보고 싶다.                         |
| LEFT JOIN  | 왼쪽 기준, 오른쪽은 있으면 | 모든 고객 목록에 빵 판매 데이터 추가, 없으면 비움 |
| RIGHT JOIN | 오른쪽 기준, 왼쪽은 있으면 | 모든 빵 판매 목록에서 누가 샀는지, 없으면 비움    |

