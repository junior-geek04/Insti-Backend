const jwt = require("jsonwebtoken");
const JWTSEC = "4#22@23322##2";

const verifyToken=(req,res,next)=>{
    let authHeader = req.headers["authorization"];

    // console.log('token:', authHeader);
    authHeader = authHeader.split(" ")[1];
    if(authHeader)
    {
        const token=authHeader;
        jwt.verify(token,JWTSEC,(err,user)=>{
            if(err)
            {
                return res.status(400).json("error ocurred");
               
            }
            req.user=user;
            next();
        })
    }
    else{
    //  console.log(authHeader);
return res.status(400).json("token is not valid");
    }
}

module.exports={verifyToken};