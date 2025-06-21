import express from 'express';
import dotenv from 'dotenv';
import {createProduto, getProdutos, uploadMiddleware} from './controllers/produtos';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de E-commerce para Artesãos');
});

app.get('/produtos', getProdutos);
app.post('/produtos', uploadMiddleware, createProduto);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));