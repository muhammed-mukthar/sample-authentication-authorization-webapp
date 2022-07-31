const express=require('express')
const { Admin } = require('mongodb')
const { response } = require('../app')
const app = require('../app')
const router=express.Router()
const adminhelpers=require('../helpers/adminhelpers')
const userhelpers = require('../helpers/userhelpers')

// validation middleware
const validadmin=(req,res,next)=>{
   if( req.session.isadminlogin){
    next()
   }else{
    res.redirect('/admin/login')
   }
}

//admin homepage

router.get('/',validadmin,(req,res)=>{
    res.setHeader('Cache-Control','no-store')
  if( req.session.isadminlogin){
    adminhelpers.getAllUsers().then((userdisplay)=>{
      req.session.editusererror=false
        // console.log(userdisplay);
        res.render('./adminview/adminhome',{userdisplay:userdisplay})
    })
}else{
    res.redirect('/admin/login')
}
    
})

//admin  LOGIN  POST request

router.post('/login',(req,res)=>{
    adminhelpers.adminLogin(req.body).then((response)=>{
        if(response.status){
          req.session.isadminlogin=true
          req.session.user=response.user
    
          res.redirect('/admin')
        }else{
          req.session.admininvalid="incorrect details"
          res.redirect('/admin/login')
        }
      })
  })


  //admin Login Get request

  router.get('/login',(req,res)=>{
    res.setHeader('Cache-Control','no-store')
    if(req.session.isadminlogin){
       
        res.redirect('/admin')
    }if(req.session.islogin){
        
        res.redirect('/users/userhome')
      }else{
        res.render('./adminview/adminlogin',{invalid:req.session.admininvalid})
    }
  })

//admin adduser GET request

router.get('/adduser',validadmin,(req,res)=>{
    res.render('./adminview/adminadduser',{title:"admin adduser",loginerr:req.session.loger})
})

//admin adduser Post request


router.post('/adduser',(req,res)=>{
 adminhelpers.AdminaddUser(req.body).then((response)=>{
    if(response){
        req.session.loger=false
        res.redirect('/admin/login')
        
      }else{
        req.session.loger="username already exists"
        res.redirect('/admin/adduser')
      }
        
        
   
 })
})

//admin delete user 

router.get('/deleteuser/:id',validadmin,(req,res)=>{
    let userId=req.params.id
    console.log(userId);
    adminhelpers.deleteUser(userId).then((response)=>{
        res.redirect('/admin')
    })

})

//admin edit user GET

router.get('/edituser/:id',validadmin,async(req,res)=>{
let userdata=await adminhelpers.getuserdetails(req.params.id)
    // console.log(userdata);
    res.render('./adminview/admineditusr',{userdata,editusererror: req.session.editusererror})
})

// admin edit user POST

router.post('/edituser/:id',(req,res)=>{
    adminhelpers.updateUser(req.params.id,req.body).then((isithere)=>{
     
      if(isithere){
        console.log(isithere);
        req.session.editusererror=false
        res.redirect('/admin')
    }else{
      req.session.editusererror="ALREADY EXISTS"
      // res.redirect('/admin')
      console.log(isithere);
      res.redirect('/admin')
    }
  })
  
})

//admin logout


router.get('/logout',(req,res)=>{
    
    req.session.destroy()
   
    res.redirect('/')
  })



module.exports=router