const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controller/login');
const { validar } = require('../middlewares/validarCampos');

const router = Router();

router.post('/',[
    // check('email','email invalid').isEmail(),
    // check('pas','the password must be more than 5 letters').isLength({min:5}),
    validar
], login);

module.exports = router;
