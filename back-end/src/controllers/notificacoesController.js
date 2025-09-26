import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import NotificacoesService from '../services/notificacoesService.js';

const notificacoesService = new NotificacoesService();

const storageDir = 'D:\\storage';
const imagesDir = path.join(storageDir, 'images');
const filesDir = path.join(storageDir, 'files');
const newsFilePath = path.join(storageDir, 'news.json');

// Ensure storage directories exist
const setupStorage = async () => {
    try {
        await fs.mkdir(imagesDir, { recursive: true });
        await fs.mkdir(filesDir, { recursive: true });
        try {
            await fs.access(newsFilePath);
        } catch {
            await fs.writeFile(newsFilePath, JSON.stringify([]));
        }
    } catch (error) {
        console.error("Error setting up storage directories:", error);
    }
};
setupStorage();


// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'image') {
            cb(null, imagesDir);
        } else if (file.fieldname === 'file') {
            cb(null, filesDir);
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});


const readNews = async () => {
    try {
        const data = await fs.readFile(newsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
};

const writeNews = async (data) => {
    await fs.writeFile(newsFilePath, JSON.stringify(data, null, 2));
};

export const getAllNews = async (req, res) => {
    try {
        const notifications = await notificacoesService.getByUserId(req.user.userId);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar notificações.' });
    }
};

export const getNewsById = async (req, res) => {
    try {
        const news = await readNews();
        const post = news.find(p => p.id === parseInt(req.params.id));
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error reading news data.' });
    }
};


export const createNews = [
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
    async (req, res) => {
        try {
            const { title, content, type } = req.body;
            const news = await readNews();
            
            const newPost = {
                id: news.length > 0 ? Math.max(...news.map(p => p.id)) + 1 : 1,
                title,
                content,
                type,
                date: new Date().toISOString(),
                imageUrl: req.files.image ? `/api/notificacoes/images/${req.files.image[0].filename}` : null,
                fileUrl: req.files.file ? `/api/notificacoes/files/${req.files.file[0].filename}` : null
            };

            news.push(newPost);
            await writeNews(news);

            // Send notification to all users
            await notificacoesService.sendNotificationToAllUsers(
                `Nova ${type === 'alert' ? 'alerta' : 'notícia'}: ${title}`,
                type,
                `/noticias/${newPost.id}`
            );

            res.status(201).json(newPost);
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).json({ message: 'Error creating news post.' });
        }
    }
];

export const updateNews = [
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content, type } = req.body;
            const news = await readNews();
            const postIndex = news.findIndex(p => p.id === parseInt(id));

            if (postIndex === -1) {
                return res.status(404).json({ message: 'Post not found.' });
            }

            const post = news[postIndex];

            if (req.files.image && post.imageUrl) {
                const oldImagePath = path.join(storageDir, post.imageUrl);
                try {
                    await fs.unlink(oldImagePath);
                } catch (err) {
                    console.error("Could not delete old image:", err);
                }
            }

            if (req.files.file && post.fileUrl) {
                const oldFilePath = path.join(storageDir, post.fileUrl);
                try {
                    await fs.unlink(oldFilePath);
                } catch (err) {
                    console.error("Could not delete old file:", err);
                }
            }

            const updatedPost = {
                ...post,
                title: title || post.title,
                content: content || post.content,
                type: type || post.type,
                // ================== INÍCIO DA CORREÇÃO 2 ==================
                imageUrl: req.files.image ? `/api/notificacoes/images/${req.files.image[0].filename}` : post.imageUrl,
                fileUrl: req.files.file ? `/api/notificacoes/files/${req.files.file[0].filename}` : post.fileUrl
                // =================== FIM DA CORREÇÃO 2 ====================
            };

            news[postIndex] = updatedPost;
            await writeNews(news);
            res.json(updatedPost);
        } catch (error) {
            console.error("Error updating post:", error);
            res.status(500).json({ message: 'Error updating news post.' });
        }
    }
];

export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        let news = await readNews();
        const initialLength = news.length;
        const postToDelete = news.find(p => p.id === parseInt(id));

        if (!postToDelete) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        news = news.filter(p => p.id !== parseInt(id));

        if (postToDelete.imageUrl) {
            const imagePath = path.join(storageDir, postToDelete.imageUrl);
            try {
                await fs.unlink(imagePath);
            } catch (err) {
                console.error("Could not delete associated image:", err);
            }
        }

        if (postToDelete.fileUrl) {
            const filePath = path.join(storageDir, postToDelete.fileUrl);
            try {
                await fs.unlink(filePath);
            } catch (err) {
                console.error("Could not delete associated file:", err);
            }
        }

        await writeNews(news);
        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: 'Error deleting news post.' });
    }
};

export const downloadFile = async (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(filesDir, fileName);

    res.download(filePath, (err) => {
        if (err) {
            console.error("Error downloading file:", err);
            res.status(404).json({ message: "File not found." });
        }
    });
};