import {Produto} from '../models/produtoModel';
import {supabase} from '../utils/supabaseClient';

interface CriarProdutoParams {
    nome: string;
    preco: number;
    estoque: number;
    file: Express.Multer.File;
}

export async function listarProdutos(): Promise<Produto[]> {
    const {data, error} = await supabase.from('produtos').select('*');
    if (error) throw new Error(error.message);
    return data as Produto[];
}

export async function criarProduto(params: CriarProdutoParams): Promise<Produto> {
    const {nome, preco, estoque, file} = params;
    const fileName = `${Date.now()}_${file.originalname}`;
    const {error: uploadError} = await supabase.storage
        .from('produtos-imagens')
        .upload(fileName, file.buffer, {contentType: file.mimetype});

    if (uploadError) throw new Error(`Erro ao fazer upload da imagem: ${uploadError.message}`);

    const {data: urlData} = supabase.storage
        .from('produtos-imagens')
        .getPublicUrl(fileName);

    const imagem_url = urlData.publicUrl;

    const {data, error} = await supabase
        .from('produtos')
        .insert([{nome, preco, estoque, imagem_url}])
        .select();

    if (error) throw new Error(`Erro ao criar produto: ${error.message}`);

    return data![0] as Produto;
}