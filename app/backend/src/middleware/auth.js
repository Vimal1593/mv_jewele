import jwt from 'jsonwebtoken';

export const requireAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ success: false, message: "Authentication required" });
    
    // In dev, use the hardcoded JWT secret we defined in docker-compose.yml
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_for_dev_only_change_in_prod');
    if (decoded.role !== 'admin') throw new Error("Not an admin");
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};
