import multer from 'multer';

const currentDir = '/Egg-Java/Sprint-Los-Bepis/CODEHOUSE/TP-Entrega1';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, currentDir + "/public/img");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + '-' + file.originalname);
  }
});

export const uploader = multer({ storage });