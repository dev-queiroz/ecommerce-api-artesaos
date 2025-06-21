import {mockRequest, mockResponse} from 'jest-mock-req-res';
import {createClient} from '@supabase/supabase-js';
import {createProduto, getProdutos, uploadMiddleware} from '../controllers/produtos';
import supertest = require('supertest');
import express = require('express');

// Configurar o app sem iniciar o servidor
const app = express();
app.use(express.json());
app.get('/produtos', getProdutos);
app.post('/produtos', uploadMiddleware, createProduto);

// Mock do Supabase
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn().mockReturnValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn(),
        insert: jest.fn().mockReturnThis(),
        storage: {
            from: jest.fn().mockReturnThis(),
            upload: jest.fn(),
            getPublicUrl: jest.fn(),
        },
    }),
}));

describe('Produtos Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Teste unitário para GET /produtos
    it('Deve listar produtos com sucesso', async () => {
        const mockData = [
            {id: 1, nome: 'Anel', preco: 40, estoque: 6, imagem_url: 'url'},
        ];
        const supabaseMock = (createClient as jest.Mock)().from('produtos').select;
        supabaseMock.mockResolvedValue({data: mockData, error: null});

        const req = mockRequest();
        const res = mockResponse();

        await getProdutos(req, res);
        expect(res.json).toHaveBeenCalledWith(mockData);
        expect(supabaseMock).toHaveBeenCalledWith('*');
    });

    // Teste de integração para GET /produtos
    it('Deve retornar 200 ao listar produtos via API', async () => {
        const mockData = [
            {id: 1, nome: 'Anel', preco: 40, estoque: 6, imagem_url: 'url'},
        ];
        const supabaseMock = (createClient as jest.Mock)().from('produtos').select;
        supabaseMock.mockResolvedValue({data: mockData, error: null});

        const response = await supertest(app).get('/produtos');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
    });

    // Teste unitário para POST /produtos
    it('Deve criar produto com imagem', async () => {
        const mockFile = {buffer: Buffer.from(''), originalname: 'test.jpg', mimetype: 'image/jpeg'};
        const mockBody = {nome: 'Brinco', preco: '25', estoque: '8'};
        const mockUpload = {data: {}, error: null};
        const mockUrl = {publicUrl: 'https://example.com/test.jpg'};
        const mockInsert = [
            {id: 2, nome: 'Brinco', preco: 25, estoque: 8, imagem_url: mockUrl.publicUrl},
        ];

        const supabaseMock = (createClient as jest.Mock)();
        supabaseMock.storage.from().upload.mockResolvedValue(mockUpload);
        supabaseMock.storage.from().getPublicUrl.mockReturnValue({data: mockUrl});
        supabaseMock.from().insert().select.mockResolvedValue({data: mockInsert, error: null});

        const req = mockRequest({body: mockBody, file: mockFile});
        const res = mockResponse();

        await createProduto(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockInsert[0]);
    });
});