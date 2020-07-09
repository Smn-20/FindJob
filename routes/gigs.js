const express=require('express');
const router=express.Router();
const db=require('../config/database');
const Gig=require('../models/Gig');
const Sequelize=require('sequelize');
const Op = Sequelize.Op;

//Get gigs
router.get('/',(req,res)=>{
  Gig.findAll()
  .then(gigs=>{
      res.render('gigs',{gigs})
    })
  .catch(err=>console.log(err))
})
//Get add job form
router.get('/add',(req,res)=>{
  res.render('add');
})
//Add job
router.post('/add',(req,res)=>{
  let{ title, technologies, budget, description, email } = req.body;
  let errors=[];

  if(!title){
    errors.push({text:'Please add a title'})
  }
  if(!technologies){
    errors.push({text:'Please add some technologies'})
  }
  if(!description){
    errors.push({text:'Please add a description'})
  }
  if(!email){
    errors.push({text:'Please add an email'})
  }

  //Check errors
  if(errors.length>0){
     res.render('add',{errors})
  }else{
    if(!budget){
      budget='Unkown';
    }else{
      budget=`$${budget}`;
    }
    //Make lowercase and remove space after coma
    technologies=technologies.toLowerCase().replace(/, /g, ',');
      //Insert into table
      Gig.create({
        title,
        technologies,
        budget,
        description,
        email
      }).then(gig => res.redirect('/jobs'))
      .catch(err=>console.log(err));
  }

})

//Search for gigs
router.get('/search',(req,res)=>{
  const {term}=req.query;
  Gig.findAll({
    where:{technologies:{[Op.like]:'%'+term+'%'}}
  }).then(gigs=>res.render('gigs',{gigs}))
  .catch(err=>console.log(err))
})
module.exports=router;