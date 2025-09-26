import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = process.env.UPLOAD_DIR ? path.resolve(process.cwd(), '..', process.env.UPLOAD_DIR) : path.join(process.cwd(), 'storage', 'nfs');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const month = String(new Date().getMonth() + 1).padStart(2, '0'); // Get 2-digit month number
    const colaborador = req.user.nome ? req.user.nome.split(' ')[0].toLowerCase() : 'colaborador';
    const filename = `nf_01-${month}_${colaborador}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas PDF é permitido!'), false);
    }
  }
}).single('nfs');

class NfsController {
  uploadNfs = (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a file.' });
      }
      res.status(200).json({ message: 'NF enviada com Sucesso!', file: req.file });
    });
  };
}

export default new NfsController();
