import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false }
});

// Configuração do Multer para upload de imagens
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Apenas imagens JPEG ou PNG são permitidas'));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
});

// Endpoint GET /produtos
export const getProdutos = async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('produtos').select('*');
    if (error) {
        console.error('Erro ao listar produtos:', error.message);
        res.status(500).json({ error: 'Erro ao listar produtos' });
        return;
    }
    res.json(data);
};

// Endpoint POST /produtos com upload de imagem
export const createProduto = async (req: Request, res: Response): Promise<void> => {
    const { nome, preco, estoque } = req.body;

    // Validação básica
    if (!nome || !preco || !estoque) {
        res.status(400).json({ error: 'Campos obrigatórios: nome, preco, estoque' });
        return;
    }

    // Upload da imagem para o Supabase Storage
    let imagem_url: string | null = null;
    if (req.file) {
        const fileName = `${Date.now()}_${req.file.originalname}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('produtos-imagens')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
            });

        if (uploadError) {
            console.error('Erro no upload:', uploadError.message);
            res.status(500).json({ error: `Erro ao fazer upload da imagem: ${uploadError.message}` });
            return;
        }

        // Obter URL pública da imagem
        const { data: urlData } = supabase.storage
            .from('produtos-imagens')
            .getPublicUrl(fileName);
        imagem_url = urlData.publicUrl;
    } else {
        res.status(400).json({ error: 'Imagem obrigatória' });
        return;
    }

    // Inserir produto no banco
    const { data, error } = await supabase
        .from('produtos')
        .insert([{ nome, preco, estoque, imagem_url }])
        .select();

    if (error) {
        console.error('Erro ao inserir produto:', error.message);
        res.status(500).json({ error: `Erro ao criar produto: ${error.message}` });
        return;
    }

    res.status(201).json(data![0]);
};

// Exportar o middleware do Multer para usar na rota
export const uploadMiddleware = upload.single('imagem');