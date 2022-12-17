const { Router } = require('express');

const router = Router();

router.get('/*', (req ,res) => {
    res.sendFile(__dirname.substring(0, __dirname.search('router')) + '/public/404.html');
});

router.post('/*', (req, res) => {
    return res.status(404).json({
        msg: 'the path is invalid, check the route please'
    })
});

router.put('/*', (req, res) => {
    return res.status(404).json({
        msg: 'the path is invalid, check the route please'
    })
})
router.delete('/*', (req, res) => {
    return res.status(404).json({
        msg: 'the path is invalid, check the route please'
    })
})

module.exports = router;