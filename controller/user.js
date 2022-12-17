const { db } = require("../database/config");
const { generarJWT } = require("../helper/generarToken");
const bcryptjs = require('bcryptjs')

const getUsers = async (req, res) => {
    const pg = await db;
    const sql = 'SELECT * FROM USERS WHERE estado = $1 order by id_user desc';

    pg.query(sql, [true] , (err, result) => {
        if(err){
            return res.status(500).json({
                code: err.code, 
                name: err.name, 
                hint: err.hint,
                detail: err.detail,
                where: err.where,
                file: err.file
            });
        }else{
            if(result.rowCount >= 1){
                return res.status(200).json(result.rows)
            }else{
                return res.status(400).json({
                    msg: 'there was an error'
                })
            }
        }
    })
}
const getUser = async (req, res) => {
    try{
        const pg = await db;
        const { id } = req.params;
        const sql = 'SELECT * FROM users where id_user = $1 and estado = $2';
        pg.query(sql, [ id, true] , (err, result) => {
            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file
                })
            }else{
                if(result.rowCount === 1) {
                    return res.status(200).json(result.rows[0])
                }else{
                    return res.status(404).json({
                        msg: `no user with the id ${id}`
                    })
                }
            }
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg: 'there was an error talk to the administrator'
        })
    }
}
const postUser = async (req, res) => {
    const pg = await db;
    const { id_user, ...resto} = req.body;
    console.log(req.body);
    try {
        const yy = new Date().getFullYear();
        const mm = new Date().getMonth() + 1;
        const dd = new Date().getDate();
        const token = await generarJWT( resto.email);

        const sql = 'SELECT * FROM USERS WHERE email = $1';
        const sql2 = 'INSERT INTO USERS (first_name, email, pas, fecha, estado, tokens) values ($1,$2,$3,$4,$5,$6)';

        pg.query(sql, [ resto.email] , (err, result) => {
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
                if(result.rowCount !== 1){

                    const salt = bcryptjs.genSaltSync();
                    const pa = bcryptjs.hashSync(resto.pas, salt);

                    pg.query(sql2, [ resto.first_name, resto.email, pa, (yy +"/"+ mm + "/" +dd), true, token], (err, result) => {
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
                            if(result.rowCount === 1) {
                                return res.status(200).json({
                                    msg: 'registered',
                                    token
                                })
                            }else{
                                return res.status(400).json({
                                    msg: 'there was an error during the registration'
                                })
                            }
                        }
                    });
                }else{
                    return res.status(400).json({
                        msg: 'the email exist'
                    })
                }
            }
        });

    }catch(err){
        return res.status(500).json({
            msg: 'there was an error tell to the administrator'
        })
    }
}
const putUser = async (req, res) => {
    try{

        const pg = await db;
        const emailLogged = req.user.email;
        const { id_user, ...resto } = req.body;
        const sql = 'select * from users where email = $1';
        const sql2 = 'update users set first_name = $1, email = $2, pas = $3, fecha = $4, tokens = $5 where email = $6';
        
        pg.query(sql, [ resto.email] , (err, result) => {
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
                if((result.rowCount === 0) || ((result.rowCount === 1) && (result.rows[0].email === emailLogged))){
                     
                    try{

                        const token = generarJWT(resto.email);
                        const yy = new Date().getFullYear();
                        const mm = new Date().getMonth() + 1;
                        const dd = new Date().getDate();
                        
                        pg.query(sql2, [resto.first_name, resto.email, resto.pas, (yy + "/" + mm + "/" + dd), token, emailLogged], (err, result) => {
                            if(err){
                                return res.status(500).json({
                                    code: err.code, 
                                    name: err.name, 
                                    hint: err.hint,
                                    detail: err.detail,
                                    where: err.where,
                                    file: err.file,
                                }); 
                            }else{
                                if(result.rowCount === 1){
                                    return res.status(200).json({
                                        msg: 'updated successfully'
                                    })
                                }else{
                                    return res.status(500).json({
                                        msg: 'there was an error during the updating'
                                    })
                                }
                            }
                        })

                    }catch(err){
                        console.log(err);
                        return res.status(500).json({
                            msg: 'there was and error talk to the administration'
                        })
                    }

                }else{
                    return res.status(400).json({
                        msg: 'email is registered'
                    })  
                }
            }
        });
    }catch(err){
        console.log(err);
        return res.static(500).json({
            msg: 'there was an error'
        })
    }
}
const deleteUser = async (req, res) => {
    try{

        const pg = await db;
        const emailLogged = req.user.email;
        const sql = 'select * from users where email = $1 and estado = $2';
        const sql2 = 'update users set estado = $1 where email = $2';

        pg.query(sql, [ emailLogged, true], (err, result) => {
            if(err){
                return res.status(500).json({
                    code: err.code, 
                    name: err.name, 
                    hint: err.hint,
                    detail: err.detail,
                    where: err.where,
                    file: err.file,
                });
            }else{
                if(result.rowCount === 1){
                    pg.query(sql2, [ false, emailLogged], (err, result) => {
                        if(err){
                            return res.status(500).json({
                                code: err.code, 
                                name: err.name, 
                                hint: err.hint,
                                detail: err.detail,
                                where: err.where,
                                file: err.file,
                            });
                        }else{
                            if(result.rowCount === 1){
                                return res.status(200).json({
                                    msg: 'successfully eliminated'
                                })
                            }else{
                                return res.status(400).json({
                                    msg: `error can't be eliminated `
                                })
                            }
                        }
                    })
                }else{
                    return res.status(400).json({
                        msg: 'User eliminated'
                    })
                }
            }
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            msg: 'err during the query'
        })
    }
}

module.exports = {
    getUsers,
    getUser,
    postUser,
    putUser,
    deleteUser,
}