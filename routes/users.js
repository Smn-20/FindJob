const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');
const User=require('../models/User');
const auth=require('../middleware/auth');

//Register a user
router.post('/', async (req,res)=>{
    let{ names, email, password, password2 } = req.body;
    let errors=[];;
    
    
    if(!names){
        errors.push({text:'Please add your full name'})
      }
      if(!email){
        errors.push({text:'Email is required'})
      }
      if(password.length<6){
        errors.push({text:'Please enter a password of 6 characters or more'})
      }
      if(password!==password2){
        errors.push({text:'The passwords have to match!'})
      }
      if(errors.length>0){
        res.render('signup',{errors})
     }
    else{
        try {
            let user = await User.findOne({ where: { email: email } });
            //check if the user already exists
            if(user){
               return res.status(400).json({errors:[{msg:'User already exists!'}]})
            }
    
            user=new User({
                names,
                email,
                password
            })
            //encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);
    
            //save the user in the database
            await user.save();
           //implementation of the jsonwebtoken
           const payload={
               user:{
                   id:user.id
               }
           }
           jwt.sign(payload,config.get('jwtSecret'),{expiresIn:360000},(err,token)=>{
              if(err) throw err;
              res.json({token});
           });
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
    
    
})

//Authentication test
router.get('/authentication',auth, async (req,res)=>{
   try {
       const user = await User.findByPk(req.user.id);
       res.json(user);
   } catch (err) {
       console.error(err.message);
       res.status(500).send('Server error');
   }
})

//login user and authenticate with token

router.post('/authentication', async (req,res)=>{

    let { email, password }=req.body;
    let errors=[];
    
    try {
        let user = await User.findOne({ where: { email: email } });
        //check if the user already exists
        if(!user){
            errors.push({text:'Invalid credentials'})
           return res.render('login',{errors})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            errors.push({text:'Invalid credentials'})
           return res.render('login',{errors})
        }
        const payload={
           user:{
               id:user.id
           }
        }
        jwt.sign(payload,config.get('jwtSecret'),{expiresIn:360000},(err,token)=>{
          if(err) throw err;
          res.json({token});
        });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    
})

module.exports=router;