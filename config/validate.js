function signupValidate(req, res, next){
  req.checkBody('fullname', 'Full name is Required').notEmpty();
  req.checkBody('fullname', 'Full name must not be less than 5 chars').isLength({min:5});
  req.checkBody('email', 'Email is Required and not empty').notEmpty();
  req.checkBody('email', 'Email is Invalid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password', 'Password must not be less than 5 chars').isLength({min:5});
  req.check("password", "Password must contain at least 1 number").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");
  var errors = req.validationErrors();
  if(errors){
    var messages = [];
    errors.forEach((error) => {
      messages.push(error.msg);
    });

    req.flash('error', messages);
    res.redirect('/signup');
  }else{
    return next();
  };
};

function loginValidate(req, res, next){
  req.checkBody('email', 'Email is Required and not empty').notEmpty();
  req.checkBody('email', 'Email is Invalid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password', 'Password must not be less than 5 chars').isLength({min:5});
  req.check("password", "Password must contain at least 1 number").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");
  var loginErrors = req.validationErrors();
  if(loginErrors){
    var messages = [];
    loginErrors.forEach((error) => {
      messages.push(error.msg);
    });

    req.flash('error', messages);
    res.redirect('/login');
  }else{
    return next();
  };
};

/*
function pwValidate(req, res, next){
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password', 'Password must not be less than 5 chars').isLength({min:5});
  req.check("password", "Password must contain at least 1 number").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");
  var pwErrors = req.validationErrors();
  if(req.password == req.body.cpassword){
    var messages = [];
    pwErrors.forEach((error) => {
      messages.push(error.msg)
    });

    var errors = req.flash('error');
    res.redirect('/reset/'+req.params.token);
  }else{
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetToken = undefined;

    user.save((err) => {
      req.flash('success', 'Your password has been successfully updated.');
      callback(err, user);
    })
  }
}else{
  req.flash('error', 'Password and confirm password are not equal.');
  res.redirect('/reset/'+req.params.token);
}
*/
module.exports = {
  signupValidate,
  loginValidate
};
