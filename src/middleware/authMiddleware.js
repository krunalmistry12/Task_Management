import jwt from 'jsonwebtoken'

function authMiddleware (req,res,next) {
  const token  = req.headers['authorization']
  if(!token) { return res.status(401).json({message: "no tokne provided"})}

  jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{
    if(err) {return res.status(401).json({message:"invalid token"})}
    req.userId=decoded.id
    next()
  })
  // if (!token) {
  //   return res.status(401).json({ error: 'Authorization token is required' });
  // }

  // try {
  //   const decoded = jwt.verify(token, 'your_jwt_secret');  // Replace with your secret
  //   req.userId = decoded.userId;  // Make sure `userId` is included in the token payload
  //   next();
  // } catch (err) {
  //   return res.status(401).json({ error: 'Invalid or expired token' });
  // }
}

export default authMiddleware;
