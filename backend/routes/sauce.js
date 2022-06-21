const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

/**Create one */
router.post('/', auth, multer, sauceCtrl.createSauce);
/**Like a sauce */
router.post('/:id/like', auth, sauceCtrl.likeSauce);
/**update one */
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
/**Delete one */
router.delete('/:id', auth, sauceCtrl.deleteSauce);
/**Get one */
router.get('/:id', auth, sauceCtrl.getOneSauce);
/**Get all */
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router;