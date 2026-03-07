const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
app.use(express.json());

const protect = async (req,res, next) =>{
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
             req.user = await User.findById(decoded.id) ;
             next();
        }
        catch (error){
            res.status(401).json({message: "Not authorized, token failed"});

        }
    }
};

exports.checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    
    
    const allPermissions = await req.user.getAllPermissions();


    if (!allPermissions.includes(requiredPermission)) {
      return res.status(403).json({ 
        message: 'Access denied' 
      });
    }

    
    next();
  };
};
exports.can = (permission) => [
  exports.protect,
  exports.checkPermission(permission)
];
