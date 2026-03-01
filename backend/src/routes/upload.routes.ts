import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req: any, file: any, cb: any) {
        cb(null, 'uploads/');
    },
    filename(req: any, file: any, cb: any) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file: any, cb: any) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req: any, file: any, cb: any) {
        checkFileType(file, cb);
    },
});

router.post('/', upload.single('image'), (req: any, res: any) => {
    if (!req.file) {
        return res.status(400).send({ success: false, message: 'No file uploaded' });
    }
    res.send({ success: true, data: `/${req.file.path.replace(/\\\\/g, '/')}` });
});

export default router;
