const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');

/**Create one */
router.post('/', auth, multer, stuffCtrl.createThing);
/**update one */
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
/**Delete one */
router.delete('/:id', auth, stuffCtrl.deleteThing);
/**Get one */
router.get('/:id', auth, stuffCtrl.getOneThing);
/**Get all */
router.get('/', auth, stuffCtrl.getAllThings);


module.exports = router;