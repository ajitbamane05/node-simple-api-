module.exports = function (req, res, next) { 

    if (!req.user.isAUDITOR) return res.status(401).send('You are not authorized as auditor');
  
    next();
  }