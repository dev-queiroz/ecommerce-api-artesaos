import {jest} from '@jest/globals';

// Mockar o módulo yamljs para evitar erros no Swagger durante os testes
jest.mock('yamljs', () => ({
    parse: jest.fn().mockReturnValue({}),
}));