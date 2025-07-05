import {Request, Response} from 'express';
import {uploadMiddleware} from '../middlewares/upload';
import * as produtoService from '../services/produtoService';

export const getProdutos = async (req: Request, res: Response): Promise<void> => {
    try {
        const produtos = await produtoService.listarProdutos();
        res.json(produtos);
    } catch (error: any) {
        console.error('Erro ao listar produtos:', error.message);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
};

export const createProduto = async (req: Request, res: Response): Promise<void> => {
    const { nome, preco, estoque } = req.body;

    if (!nome || !preco || !estoque) {
        res.status(400).json({ error: 'Campos obrigatórios: nome, preco, estoque' });
        return;
    }

    if (!req.file) {
        res.status(400).json({ error: 'Imagem obrigatória' });
        return;
    }

    try {
        const produto = await produtoService.criarProduto({
            nome,
            preco,
            estoque,
            file: req.file
        });
        res.status(201).json(produto);
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
};

export {uploadMiddleware};