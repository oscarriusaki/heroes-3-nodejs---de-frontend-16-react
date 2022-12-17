const jwt = require('jsonwebtoken');
const { db } = require('../database/config');

const validarJWT = async (req, res, next) => {
    try{

        const pg = await db;
        const token = req.header('x-token');
        const { email } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const sql = 'select * from users where email = $1 and estado = $2';

        pg.query(sql, [ email, true], (err, result) => {
            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file,
                })
            }else{
                if(result.rowCount === 1){
                
                    req.user = result.rows[0];
                    next();

                }else{
                    return res.status(400).json({
                        msg: 'there was an error to search the email or user eliminated'
                    })
                }
            }
        })
        

    }catch(err){
        console.log(err)
        return res.status(500).json({
            msg: 'Token expired or invalid token'
        })
    }
}

module.exports = {
    validarJWT
}