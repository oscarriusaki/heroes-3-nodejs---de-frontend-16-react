const express = require('express');
const cors = require('cors');
const { db } = require('../database/config');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.path = {
            user: '/user',
            login: '/login',
            hero:'/hero',
            error: '/'
        }
        // database
        this.database();
        // middlewares
        this.middlewares();
        //router
        this.router();
    }
    async database(){
        try{

            const pg = await db;
            pg.connect((err, client, release) => {
                if(err){
                    return console.error('error executing query', err.stack)
                }
                
                console.log('Connect')
            });

        }catch(err){
            console.log(err)
            throw new Error(err)
        }
        
    }
    middlewares(){
        // allow routes
        this.app.use(cors());
        // read data type json
        this.app.use(express.json())
        // file public
        this.app.use(express.static('public'));
    }

    router (){  
        this.app.use(this.path.user, require('../router/user'));
        this.app.use(this.path.login, require('../router/login'));
        this.app.use(this.path.hero, require('../router/hero'));
        this.app.use(this.path.error, require('../router/error'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`server running at ${this.port}`)
        })
    }
}

module.exports = Server;