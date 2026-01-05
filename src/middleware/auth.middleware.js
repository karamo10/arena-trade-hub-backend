import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // split method make the a 
 
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Token expired or invalid' });
    }
    req.user = user;
    next();
  });
}
// before a request reach a protected route or try to peroform a perticular task the (authenticateToken) middleware 
// can check and verify if the user is granted access to that protected route or perform that task

export function authorizeAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'admin only' });
  }
  next();
}

// this protect a routes that only need to access by the Admin user only