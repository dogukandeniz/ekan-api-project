const jwt = require('jsonwebtoken')
const config = require('../helpers/config')

module.exports = (req, res, next) => {

    const token =req.query.token || req.headers['x-access-token'] || req.body.token 

    if(token){
        jwt.verify(token,config.api_secret_key,(err,decoded)=> {

            if(err){
                res.json({
                    status:false,
                    message:'Failed  to authenticate token'
                })
            }else{
                req.decodde = decoded;
                next()
            }
        })  
    }else{
        res.json({
            status:false,
            message: 'No token provided'
        })
    }
}