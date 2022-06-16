const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/sauce');

/**Create one */
router.post('/', auth, multer, stuffCtrl.createSauce);
/**Like a sauce */
router.post('/:id/like', auth, stuffCtrl.likeSauce);
/**update one */
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
/**Delete one */
router.delete('/:id', auth, stuffCtrl.deleteSauce);
/**Get one */
router.get('/:id', auth, stuffCtrl.getOneSauce);
/**Get all */
router.get('/', auth, stuffCtrl.getAllSauces);


module.exports = router;