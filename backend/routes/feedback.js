const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { feedbackController } = require('../controllers');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.post('/add', upload.single('photo'), feedbackController.add);
router.get('/getAll', feedbackController.getAll);
// router.get('/:id', bonusController.getUserById);


module.exports = router;
