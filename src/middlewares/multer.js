const multer = require('multer');

// Configuração do armazenamento
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/'); // Pasta onde os arquivos serão salvos
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({ storage });

module.exports = {
	upload,
};
