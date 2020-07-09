const express=require('express');
const exphbs=require('express-handlebars');
const path=require('path');
const PORT=process.env.PORT || 8080 ;
const bodyParser=require('body-parser');
const app=express();
const db=require('./config/database');
const Handlebars=require('handlebars');


const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
//Test the database
db.authenticate()
.then(()=> console.log('Database connected successfully!!'))
.catch(err=> console.log('Error:'+err));


//handlebars(templates engine)
app.engine('handlebars',exphbs({defaultLayout:'main',handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine','handlebars');

//Init middleware
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//Routes
app.use('/jobs',require('./routes/gigs'));
app.use('/users',require('./routes/users'));

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Get the home page
app.get('/',(req,res)=>{
    res.render('index',{layout:'landing'});
})

//Get the login page
app.get('/login',(req,res)=>{
    res.render('login')
})
//Get the signup page
app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`);
})