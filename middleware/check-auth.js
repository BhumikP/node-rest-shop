const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization
        const decoded=jwt.verify(token,process.env.MONGO_JWT_KEY)
        req.userData=decoded;
        next();
    }
    catch(err){
        return res.status(401).json({
            message:'Auth Failed token'
        })
    };
   

}