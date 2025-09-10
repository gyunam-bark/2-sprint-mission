import app from './app';
import { config } from './config/config';

app.listen(config.app.port, () => {
  console.log(`Gateway running on http://localhost:${config.app.port}`);
});
