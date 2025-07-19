----------------------------------------------------
-- EXTENSION
----------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- TYPES
----------------------------------------------------
CREATE TYPE auth_provider AS ENUM ('google', 'kakaotalk');

----------------------------------------------------
-- ENTITIES
----------------------------------------------------
-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nickname VARCHAR(30) NOT NULL CHECK (char_length(nickname) >= 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- AUTH_EMAIL
CREATE TABLE IF NOT EXISTS auth_email (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  password_hash VARCHAR(255) NOT NULL
    CHECK (char_length(password_hash) >= 8)
);

-- AUTH_OAUTH
CREATE TABLE IF NOT EXISTS auth_oauth (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider auth_provider NOT NULL,
  provider_user_id VARCHAR(255) NOT NULL,
  UNIQUE (provider, provider_user_id)
);

-- IMAGES
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  name VARCHAR(100) NOT NULL,
  ext VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(10) NOT NULL,
  description TEXT NOT NULL CHECK (char_length(description) >= 10),
  price NUMERIC NOT NULL CHECK (price >= 0),
  main_image_id UUID REFERENCES images(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- PRODUCT_IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, image_id)
);

-- TAGS
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(5) NOT NULL UNIQUE
);

-- PRODUCT_TAGS
CREATE TABLE IF NOT EXISTS product_tags (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- ARTICLES
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) >= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ARTICLE_IMAGES
CREATE TABLE IF NOT EXISTS article_images (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, image_id)
);


-- COMMENT_TARGET_TYPE
CREATE TYPE comment_target_type AS ENUM ('product', 'article');

-- COMMENTS
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content VARCHAR(255) NOT NULL CHECK (char_length(content) > 0),
  target_type comment_target_type NOT NULL,
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- PRODUCT_COMMENTS
CREATE TABLE IF NOT EXISTS product_comments (
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  PRIMARY KEY (comment_id, product_id)
);

-- ARTICLE_COMMENTS
CREATE TABLE IF NOT EXISTS article_comments (
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,

  PRIMARY KEY (comment_id, article_id)
);

----------------------------------------------------
-- LIKES
----------------------------------------------------

-- PRODUCT_LIKES
CREATE TABLE IF NOT EXISTS product_likes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, product_id)
);

-- ARTICLE_LIKES
CREATE TABLE IF NOT EXISTS article_likes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, article_id)
);

-- COMMENT_LIKES
CREATE TABLE IF NOT EXISTS comment_likes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  PRIMARY KEY (user_id, comment_id)
);

----------------------------------------------------
-- FUNCTION
----------------------------------------------------
-- 공통 UPDATE 함수
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

----------------------------------------------------
-- TRIGGERS
----------------------------------------------------
-- 트리거 적용
CREATE TRIGGER trigger_set_updated_at_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trigger_set_updated_at_products
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trigger_set_updated_at_articles
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trigger_set_updated_at_comments
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

----------------------------------------------------
-- INDEXES
----------------------------------------------------
CREATE INDEX idx_active_users ON users(id) WHERE deleted_at IS NULL;

CREATE INDEX idx_active_products ON products(id) WHERE deleted_at IS NULL;

CREATE INDEX idx_active_articles ON articles(id) WHERE deleted_at IS NULL;

CREATE INDEX idx_active_comments ON comments(id) WHERE deleted_at IS NULL;