const { db } = require("../database/config")
const path = require('path')

const getHeros = async (req, res ) => {
    const pg = await db;
    const sql = 'select * from hero where estado = $1 order by id_hero desc';
    pg.query(sql,[ true], (err, result) => {
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
                return res.status(404).json({
                    msg: `no hero in the database`
                })
            }
        }
    })
}
const getHero = async (req, res ) => {
    const pg = await db;
    const { id } = req.params;
    const sql = 'select * from hero where id_hero = $1 and estado = $2';

    pg.query(sql, [ id, true], (err, result) => {
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
            if(result.rowCount === 1){
                return res.status(200).json(result.rows[0])
            }else{
                return res.status(404).json({
                    msg: `no hero with ${id}`
                })
            }
        }
    })
}
const getHeroPublisher = async (req, res ) => {
    const pg = await db;
    const { id } = req.params;
    const sql = 'select * from hero where publisher = $1 and estado = $2';
    console.log(id+'kkkkk');
    pg.query(sql, [ id, true], (err, result) => {
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
            // console.log(result.rows[0].routeimage);
            if(result.rowCount >= 1){
                return res.status(200).json(result.rows)
            }else{
                return res.status(404).json({
                    msg: `no hero with ${id}`
                })
            }
        }
    })
}
const getHeroPublisher1 = async (req, res ) => {
    const pg = await db;
    const { id } = req.params;
    const sql = 'select * from hero where routeimage = $1 and estado = $2';
    
    pg.query(sql, [ id, true], (err, result) => {
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
            console.log(result.rows[0]);
            if(result.rowCount >= 1){
                return res.sendFile (path.resolve(__dirname, '../images/'+result.rows[0].routeimage))
            }else{
                return res.status(404).json({
                    msg: `no hero with ${id}`
                })
            }
        }
    })
}

const postHero = async (req, res ) => {
    // console.log(path.resolve(req.file));
    const pg = await db;
    const id_user = req.user.id_user;
    const { id, superhero, publisher, alter_ego, first_appearance, characters } = req.body;
    const sql = 'insert into hero(id_user, idd, superhero, publisher, alter_ego, first_appearance, characterss, estado, originalname, routeimage, image)values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)';
    pg.query(sql, [ id_user, id, superhero, publisher, alter_ego, first_appearance, characters, true, req.file.originalname, req.file.filename, `http://localhost:8080/hero/heroes/d/p/${req.file.filename}`], (err, result) => {
    // pg.query(sql, [ id_user, id, superhero, publisher, alter_ego, first_appearance, characters, true, req.file.originalname, path.resolve(req.file.path)], (err, result) => {
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
            if(result.rowCount === 1){
                return res.status(200).json({
                    msg: 'successfully registered'
                })
            }else{
                return res.status(400).json({
                    msg: 'there was something error check please'
                })
            }
        }     
    });
}
const putHero = async (req, res ) => {
    const pg = await db;
    const { id } = req.params;
    const { id_hero, ...resto} = req.body;
    const sql = 'update hero set id_user = $1, idd = $2, superhero = $3, publisher = $4, alter_ego = $5, first_appearance = $6, characterss = $7, estado = $8, originalname = $9 where id_hero = $10';
    pg.query(sql, [ resto.id_user, resto.idd, resto.superhero, resto.publisher, resto.alter_ego, resto.first_appearance, resto.characterss, true, ' ', id], (err, result) => {
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
            if(result.rowCount === 1){
                return res.status(200).json({
                    msg: 'successfully registered'
                })
            }else{
                return res.status(400).json({
                    msg: `no hero with ${id}`
                })
            }
        }
    })

}
const deleteHero = async (req, res ) => {
    const pg = await db;
    const { id } = req.params;
    const sql = 'update hero set estado = $1 where id_hero  =$2 and estado = $3';
    pg.query(sql, [ false, id, true] , (err, result) => {
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
            if(result.rowCount === 1){
                return res.status(200).json({
                    msg: 'successfully eliminated'
                })
            }else{
                return res.status(400).json({
                    msg: 'the hero not found or eliminated'
                })
            }
        }
    })
}

module.exports = {
    getHeros,
    getHero ,
    postHero,
    putHero,
    deleteHero,
    getHeroPublisher,
    getHeroPublisher1
}