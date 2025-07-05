import multer from 'multer';

const storage = multer.memoryStorage();
export const uploadMiddleware = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Apenas imagens JPEG ou PNG são permitidas'));
        }
        cb(null, true);
    },
    limits: {fileSize: 5 * 1024 * 1024}
}).single('imagem');