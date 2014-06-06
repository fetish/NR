/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

// bcrypt for password encrypt
var bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

module.exports = {
  schema:true,

  attributes: {
    
    username: {        /* The username and display name of user */
      type: 'string',
      required: true,
//       unique: true
    },

    email: {          /* The users email address*/
      type: 'email', // Email type will get validated by the ORM
      required: true,
      unique: true
    },

    password: { /* The users encyrpted password.*/
      type: 'string'
    },

//     birthDate: { /* The birthday of the user*/
//       type: 'date'
//     },

//     image: {
//       type: 'string'
//     },

//     avatarId: {
//       type: 'string'
//     },

//     avatar: {
//       model: 'images'
//     },

//     active: {
//       type: 'boolean',
//       defaultsTo: false
//     },

//     isAdmin: {
//       type: 'boolean',
//       defaultsTo: false
//     },

//     isModerator: {
//       type: 'boolean',
//       defaultsTo: false
//     },
    
//     language: {
//       type: 'string',
//       defaultsTo: 'en-us',
//       maxLength: 6
//     }
    
    // Override toJSON instance method
    // to remove password value
    toJSON: function() {
      var obj = this.toObject();
      
      // remove password
      delete obj.password;

      // set default objectType
      obj.objectType = "person";

      return obj;
    },

    
  },
  
  
  
  // Lifecycle Callbacks
  beforeCreate: function(user, next) {

    // Create new user password before create
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);

      // hash the password along with our new salt
      bcrypt.hash(user.password, salt, function(err, crypted) {
        if(err) return next(err);

        user.password = crypted;
        next();
      });
    });

  }
  
};

