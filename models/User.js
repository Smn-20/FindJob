const Sequelize=require('sequelize');
const db=require('../config/database');

const User= db.define('user',{
    names:{
        type:Sequelize.STRING
    },
    email:{
        type:Sequelize.STRING,
        unique:true
    },
    password:{
        type:Sequelize.STRING
    }
})

module.exports=User;