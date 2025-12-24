const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // Check for token in header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            if (!token) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Non autorisé, token manquant dans l\'en-tête' 
                });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

            if (!decoded || !decoded.id) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Non autorisé, token invalide' 
                });
            }

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Non autorisé, utilisateur non trouvé' 
                });
            }

            return next();
        } catch (error) {
            console.error('Auth error:', error);
            return res.status(401).json({ 
                success: false,
                message: error.name === 'TokenExpiredError' 
                    ? 'Token expiré, veuillez vous reconnecter'
                    : 'Non autorisé, token invalide'
            });
        }
    }

    // No token provided
    return res.status(401).json({ 
        success: false,
        message: 'Non autorisé, aucun token fourni' 
    });
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Non autorisé, utilisateur non trouvé'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette route`
            });
        }
        next();
    };
};
