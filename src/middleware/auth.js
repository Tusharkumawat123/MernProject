const jwt = require('jsonwebtoken');
const FormModel = require('../model/model');
const auth = async(req, res, next)=> {
    try{
        const cookie_token = req.cookies.jwt_login;
        const authToken = jwt.verify(cookie_token,process.env.SECRET_KEY); 
        const user = await FormModel.findOne({_id:authToken._id});
        
        // Access this values on other page
        req.authToken = cookie_token;
        req.user = user;

        next();
    }catch(error){
        res.status(401).send(error);
    }
}

module.exports = auth;