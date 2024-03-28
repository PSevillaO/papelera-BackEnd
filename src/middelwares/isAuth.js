const jwt = require('jsonwebtoken');
const secret = 'PalabraSecreta123';

function jwtVerify(req, res, next){
    const token = req.headers.authorization;
    

    if(!token){
        return res.status(400).send({
            ok:false,
            message: "No Se proporciono el Token"
        })
    }


    jwt.verify(token,secret, (error, payload )=> {
        // El token es incorrecto deberimos cortar a peticion 
        if(error){
            return res.status(401).send({
                ok:false,
                message: "No Tienes Autorizacion"
            })
        }
        // El token es correcto continuamos y agregamos el payload a mi request 
        req.user = payload.user;
        // continuamos hacia el controlador
        next();
    })
}

module.exports=jwtVerify;