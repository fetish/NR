/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    // getter for current logged in user
  current: function (req, res, next) {
    if(req.isAuthenticated && req.isAuthenticated() ){

      // TODO change to join after waterline join suport is ready to use
      // if has a avatar get it after send
      if(req.user.avatarId  && !req.user.avatar){
        Images.findOneById(req.user.avatarId).exec(function(err, image) {
          req.user.avatar = image;
          respond();
        });
      }else{
        respond();
      }


    }else{
      res.send({user: {}});
    }

    function respond(){
      res.send({user: req.user});
    }
  },
  
  // return all users
  index: function (req, res) {
    User.find()
      .limit(25)
      .sort('createdAt ASC')
      .exec(function(err, users) {

      // Error handling
      if (err) {
        return console.log(err);

      // Found multiple users!
      } else {
        res.send(users);
      }
    });
  },
  
	// find a user by ID
  find: function(req, res){
    var id = req.param('id');

    User.findOneById(id)
    .exec(function(err, user){
      // add suport for json errror and warning messages in wejs message format
      if (err) {
        console.error('Error on find user: ',err);
        return res.serverError('Error on find user.');
      }

      if(!user){
        return res.notFound('User not found.');
      }

      res.send(user);
    });

  },
  

  // render the profile view (e.g. /views/show.ejs)
  show: function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) return next();
      res.view('profile', {
        user: user,
        pageTitle: user.username
      });
    });
  },


  // render the edit view (e.g. /views/edit.ejs)
  edit: function(req, res, next) {

    // Find the user from the id passed in via params
    User.findOne(req.param('id'), function foundUser(err, user) {
      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');

      res.view('editProfile', {
        user: user,
        pageTitle: 'edit user'
      });
    });
  },
  
  

  // process the info from edit view
  update: function(req, res, next) {

//     if (req.session.User.admin) {
//       var userObj = {
//         name: req.param('name'),
//         title: req.param('title'),
//         email: req.param('email'),
//         admin: req.param('admin')
//       }
//     } else {
      var userObj = {
        email: req.param('email')
//       }
    }

      User.update({id: req.param('id')}, userObj, function userUpdated(err) {
      if (err) {
        console.log(err);
        return res.redirect('/user/' + req.param('id') + '/edit');
      }

      res.redirect('/user/' + req.param('id'));
    });
  },
  
};

