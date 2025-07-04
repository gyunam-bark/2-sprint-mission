import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

const openapiPath = path.join(__dirname, '..', '..', 'openapi.json');
const openapiDocument = JSON.parse(fs.readFileSync(openapiPath, 'utf8'));

const docs = express.Router();

docs.use(swaggerUi.serve, swaggerUi.setup(openapiDocument));

export default docs;
