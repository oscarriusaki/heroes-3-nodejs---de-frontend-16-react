const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, getUser, postUser, putUser, deleteUser } = require('../controller/user');
const { validar } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');

const router = Router();

router.get('/', getUsers);
router.get('/:id',[
    check('id', 'id is invalid').isNumeric(),
    validar
], getUser);
router.post('/',[
    // check('first_name', 'The name is required').not().isEmpty(),
    // check('email', 'the email is invalid').isEmail(),
    // check('pas', 'the password is invalid and must be more than 5 words').isLength({min: 5}),
    // validar
],  postUser);
router.put('/',[
    validarJWT, 
    check('first_name', 'The name is required').not().isEmpty(),
    check('email', 'the email is invalid').isEmail(),
    check('pas', 'the password is invalid and must be more than 5 words').isLength({min: 5}),
    validar
], putUser);
router.delete('/',[
    validarJWT,
    validar
], deleteUser);

module.exports = router;
