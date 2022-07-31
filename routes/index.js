var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.setHeader('Cache-Control','no-store')
  if(req.session.islogin){
    res.redirect('/users/userhome')
  }
  else if(req.session.isadminlogin){
    res.redirect('/admin')
}else{

  res.render('index', {title: 'Select User' });
  }
});


module.exports = router;
