var express = require('express');
const session = require('express-session');
const { response } = require('../app');
var router = express.Router();
var userhelpers=require('../helpers/userhelpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.islogin){
    next()
  }else{
    res.redirect('/users')
  }
}
/* GET users listing. */



//home
router.get('/', function(req, res, next) {
  res.setHeader('Cache-Control','no-store')
  if(req.session.islogin){
    res.redirect('/users/userhome')
  }if(req.session.isadminlogin){
    res.redirect('/admin')
}
  else{

  res.render('./users/userlogin',{title:"userlogin",invalid:req.session.invalid})
  }
});

//signup get
router.get('/signup',(req,res)=>{
  res.setHeader('Cache-Control','no-store')
  if(req.session.islogin){
    res.redirect('/users/userhome')
  } if(req.session.isadminlogin){
    res.redirect('/admin')
}else{
    req.session.invalid=""
  res.render('./users/usersignup',{title:"user signup",loginerr:req.session.loger})
  req.session.loger=false
  }

  
})


//signup post 
router.post('/signup',(req,res)=>{
  
userhelpers.addUser(req.body).then((response)=>{

if(response){
  req.session.loger=false
  res.redirect('/users')
  
}else{
  req.session.loger="username already exists"
  res.redirect('/users/signup')
}
  
  
 
})
})
// router.get('/login',(req,res)=>{
  
// })


//user home page
router.get('/userhome',(req,res)=>{
  
  if( req.session.islogin){
  let usern=req.session.user
  req.session.invalid=""
  res.setHeader('Cache-Control','no-store')
  res.render('./users/userhome',{title:'user home',username:usern.username})
  }else{
    res.redirect('/')
  }
})

//login post submiting the form
router.post('/login',(req,res)=>{
  userhelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.islogin=true
      req.session.user=response.user

      res.redirect('/users/userhome')
    }else{
      
      req.session.invalid="incorrect details"
      res.redirect('/users')
    }
  })
})

//logout

router.get('/logout',(req,res)=>{
  req.session.destroy()
 
  res.redirect('/')
})




module.exports = router;
