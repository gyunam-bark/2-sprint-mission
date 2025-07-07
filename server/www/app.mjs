import { routerContainer } from "./source/router.container.mjs";

const app = document.getElementById('app');

const main = async () => {
  app.appendChild(await routerContainer('./json/auth.routes.json'));
  app.appendChild(await routerContainer('./json/user.routes.json'));
  app.appendChild(await routerContainer('./json/tag.product.routes.json'));
  app.appendChild(await routerContainer('./json/product.routes.json'));
  app.appendChild(await routerContainer('./json/comment.product.routes.json'));
  app.appendChild(await routerContainer('./json/tag.article.routes.json'));
  app.appendChild(await routerContainer('./json/article.routes.json'));
  app.appendChild(await routerContainer('./json/comment.article.routes.json'));
  app.appendChild(await routerContainer('./json/image.routes.json'));
};

main();