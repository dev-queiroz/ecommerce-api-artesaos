import express from 'express';
import dotenv from 'dotenv';
import {createProduto, getProdutos, uploadMiddleware} from './controllers/produtos';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

const swaggerDocument = yaml.load('./docs/api-docs.yaml');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de E-commerce para Artesãos');
});

app.get('/produtos', getProdutos);
app.post('/produtos', uploadMiddleware, createProduto);

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(yaml.parse(swaggerDocument)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));