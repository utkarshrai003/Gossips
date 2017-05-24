function isUserAuthenticated(req,res,next){

  if(req.session["user"] != undefined) {
    next();
  }
  else {
    res.redirect('/welcome');
  }
}

module.exports = isUserAuthenticated;
