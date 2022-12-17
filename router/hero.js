const { Router } = require('express');
const { getHeros, getHero, postHero, putHero, deleteHero, getHeroPublisher, getHeroPublisher1 } = require('../controller/hero');
const { fileUpload } = require('../middlewares/FileUpload');
const { validar } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');

const router = Router();

router.get('/', getHeros )
router.get('/:id', getHero)
router.get('/heroes/:id', getHeroPublisher)
router.get('/heroes/d/p/:id', getHeroPublisher1)
router.post('/', [
    validarJWT,
    fileUpload,
    validar
], postHero)
router.put('/:id', putHero)
router.delete('/:id', deleteHero)

module.exports = router;