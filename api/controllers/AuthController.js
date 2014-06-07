/**
 * AuthController
 *
 * @description :: Server-side logic for managing user authentication
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');

module.exports = {

  //Redirect /auth/ to /signup
  index: function (req,res)	{
		res.redirect('/signup');
	},

	// GET Signup page
  signupPage: function (req, res) {
    //TODO: If is logged in, redirect.
    if (req.session.user) {
      res.redirect('/users/current');
    }
    // return index page and let angular.js construct the page
//     res.view('home/index');
//     res.view('signup');
    res.view('signup', {
        pageTitle: 'Signup'
      });
  },

  // POST Signup method
  signup: function (req, res, next) {
    var requireAccountActivation = false;
    
    
    var user = {
      username: req.param('username'),
      email: req.param('email'),
      password: req.param('password'),
      birthdate: req.param('birthdate')
    }

//     var user = {};    
//     user.username = req.param("username");
//     user.email = req.param("email");
//     user.password = req.param("password");
//     user.birthdate = req.param("birthdate");
//     user.language = req.param("language");


    if( !sails.util.isUndefined(sails.config.site) ) {
      if( !sails.util.isUndefined( sails.config.site.requireAccountActivation ) ){
        requireAccountActivation = sails.config.site.requireAccountActivation;
      }
    }

    // if dont need a account activation email then create a active user
//     if(!requireAccountActivation)
//       user.active = true;

    var confirmPassword = req.param("confirmPassword");
    var errors;

    errors = validSignup(user, confirmPassword, res);

    if( errors.length >0 ){
      // error on data or confirm password
      res.send('400',{
        responseMessage: {
          errors: errors
        }
      });
    } else {

      User.findOneByEmail(user.email).exec(function(err, usr){
        if (err) {
            return res.send(500, { error: res.i18n("DB Error") });
        } else if ( usr ) {
            return res.send(403, {
              responseMessage: {
                errors: [
                  {
                    field: 'email',
                    type: 'validation',
                    message: res.i18n("Email already Taken")
                  }
                ]
              }
            });
        } else {
            User.create(user).exec(function(error, newUser) {
              if (error) {

                if(error.ValidationError){

                  // wrong email format
                  if(error.ValidationError.email){

                    var errors = [];
                    var errorsLength = error.ValidationError.email.length;
                    errorsLength--;

                    error.ValidationError.email.forEach( function(err, index){

                      err.field = 'email';
                      err['type'] = 'validation';
                      err.message = res.i18n(err.message);
                      errors.push(err);

                      if( errorsLength === index){
                        return res.send(403,{
                          responseMessage: {
                            errors: errors
                          }
                        });
                      }
                    });

                  }

                }else {
                  return res.send(500, {error: res.i18n("DB Error") });
                }



              } else {

                if(requireAccountActivation){
                  var options = {};

                  /**
                  EmailService.sendAccontActivationEmail(newUser, req.baseUrl , function(err, responseStatus){
                    if(err) return next(err);

                    res.send('201',{
                      responseMessage: {
                        success: [
                          {
                            message: res.i18n('Account created but is need an email validation\n, One email was send to %s with instructions to validate your account', newUser.email)
                          }
                        ]
                      }
                    });

                  });
                  */
                } else {
                  // If we don't need to activate user, Auto login...
                  // TODO add support to configure user registration activation
                  // like with email confirmation or auto login
                  req.logIn(newUser, function(err){
                    if(err) return next(err);

                    res.send('201',newUser);

                  });


                }
              }
          });
        }
      });
    }
  },

  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  },
  //GET login page
  loginPage: function (req, res) {
    // if logged in, redirect...
    if (req.session.user) {
      res.redirect('/users/current');
    }
    // return index page and let angular.js construct the page
//     res.view('home/index');
//     res.view('login');
    res.view('login', {
        pageTitle: 'Login'
      });
  },
  
  // POST login method
  login: function (req, res, next) {
      var email = req.param("email");
      var password = req.param("password");

      if(!email || !password){
        return  res.forbidden('Password and email is required');
      }

      User.findOneByEmail(email).exec(function(err, usr) {
          if (err) {
              res.send(500, { error: res.i18n("DB Error") });
          } else {
              if (usr) {
                  if (usr.verifyPassword(password)) {
                      passport.authenticate('local', function(err, usr, info) {

                        if (err) return next(err);
                        if (!usr) return res.redirect('/login');

                        req.logIn(usr, function(err){
                          if(err) return next(err);
                          
                          req.session.user = usr.id;
                          res.send(usr);
                          // TODO add suport to oauth tokens
                          //res.redirect('/');
                        });

                      })(req, res, next);

                  } else {
                      res.send(400, { error: res.i18n("Wrong Password") });
                  }
              } else {
                  res.send(404, { error: res.i18n("User not Found") });
              }
          }
      });
  },

  /**
   * Activate a user account with activation code
   */
  /*
  activate: function(req, res){
    console.log('TODO activate');
    return next();
  },

  SendPasswordResetToken: function(req, res, next){
    console.log('TODO GetloginResetToken');
    return next();
  }
*/
};


var validSignup = function(user, confirmPassword, res){
  var errors = [];

  if(!user.email){
    errors.push({
      type: 'validation',
      field: 'email',
      message: res.i18n("Field <strong>email</strong> is required")
    });
  }

  if(!user.password){
    errors.push({
      type: 'validation',
      field: 'password',
      message: res.i18n("Field <strong>password</strong> is required")
    });
  }

  if(!confirmPassword){
    errors.push({
      type: 'validation',
      field: 'confirmPassword',
      message: res.i18n("Field <strong>Confirm new password</strong> is required")
    });
  }

  if(confirmPassword != user.password){
    errors.push({
      type: 'validation',
      field: 'password',
      message: res.i18n("<strong>New password</strong> and <strong>Confirm new password</strong> are different")
    });
  }

  return errors;
};

/**
 * Check if a auth token is valid
 * TODO
 */
/*var validAuthToken = function (userId, token, cb) {
    console.log('TODO validAuthToken');
    return next();
};*/