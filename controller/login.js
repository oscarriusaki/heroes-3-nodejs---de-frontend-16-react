const { db } = require("../database/config");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helper/generarToken");

const login = async (req, res) => {
    
    try{
        
        const { email, pas} = req.body;
     console.log(req.body);
        const pg = await db;
        const sql = 'select * from users where email = $1 and estado = $2';

        pg.query(sql, [ email, true], async (err, result) => {
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
                    const passwordVerify = bcryptjs.compareSync(pas, result.rows[0].pas);
                    const token = await generarJWT(email);
                    result.rows[0].tokens = token;
                    const us = result.rows[0]
                    if(passwordVerify) {
                        const sql3 = 'update users set tokens = $1 where email = $2';
                        pg.query(sql3, [token, email], (err, result) => {
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
                                    req.user = us;
                                    return res.status(200).json({
                                        msg: 'successfully logged',
                                        token,
                                    });
                                }else{
                                    return res.status(400).json({
                                        msg: 'there was and error to put the token'
                                    });
                                }
                            }
                        })
                    }else{
                        return res.status(400).json({
                            msg: 'passwor incorrect'
                        })
                    }

                }else{
                    return res.status(404).json({
                        msg: 'correo not found'
                    })
                    // return console.error('eror')
                }
            }
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg: 'there was an error talk to the administrator'
        })
    }
}

module.exports = {
    login
}