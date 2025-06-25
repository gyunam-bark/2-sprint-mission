export class GetUserDetailResponseUser {
  email;
  nickname;
  image;
  createdAt;

  constructor(data) {
    const { email, nickname, image, createdAt } = data;
    this.email = email;
    this.nickname = nickname;
    this.image = image;
    this.createdAt = createdAt;
  }
}

export class GetUserDetailResponseOwner {
  email;
  nickname;
  image;
  createdAt;
  products;
  articles;
  productComments;
  articleComments;

  constructor(data) {
    const { email, nickname, image, createdAt, products, articles, productComments, articleComments } = data;
    this.email = email;
    this.nickname = nickname;
    this.image = image;
    this.createdAt = createdAt;
    this.products = products;
    this.articles = articles;
    this.productComments = productComments;
    this.articleComments = articleComments;
  }
}
