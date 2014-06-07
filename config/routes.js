/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://links.sailsjs.org/docs/config/routes
 */

module.exports.routes = {


  // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
  // default view engine) your home page.
  //
  // (Alternatively, remove this and add an `index.html` file in your `assets` directory)
  
  /* STATIC PAGES 
  ----------------------- */  
//   '/': {
//     view: 'static/homepage'
//   },


  // Custom routes here...
  'get /': {
    controller: 'main',
    action: 'homePage'
  },
  
  /** TODO: Seperate api routes and view routes */
  /* USERS 
  ----------------------- */
  'get /api/users': {
    controller: 'user',
    action: 'index'
  },

  'get /api/users/:id': {
    controller: 'user',
    action: 'find'
  },

  'get /users/current': {
    controller    : 'user',
    action        : 'current'
  },

  'get /user/:id': {
    controller    : 'user',
    action        : 'show'
  },
  
  'get /user/:id/edit': {
    controller    : 'user',
    action        : 'edit'
  },
  
  'post /user/:id/update': {
    controller    : 'user',
    action        : 'update'
  },
  
  /* User Auth 
  ----------------------- */
  'get /signup': {
    controller: 'auth',
    action: 'signupPage'
  },

  'post /signup': {
    controller: 'auth',
    action: 'signup'
    //view: 'users/signup'
  },
  'get /login': {
    controller: 'auth',
    action: 'loginPage'
  },
  
  'post /auth/login': {
    controller    : 'auth',
    action        : 'login'
  },

  '/auth/logout': {
    controller    : 'auth',
    action        : 'logout'
  },

  /**
  // form to get one time login email
  'get /auth/forgot-password': {
    controller    : 'auth',
    action        : 'forgotPasswordForm'
  },

  // register  form
  'get /auth/register': {
    controller    : 'auth',
    action        : 'registerForm'
  },

  'get /user/:id/activate/:token': {
    controller: 'auth',
    action: 'activate'
  },

  'post /user/:id/password/send-token': {
    controller: 'auth',
    action: 'SendPasswordResetToken'
  },*/


  // If a request to a URL doesn't match any of the custom routes above,
  // it is matched against Sails route blueprints.  See `config/blueprints.js`
  // for configuration options and examples.

};
