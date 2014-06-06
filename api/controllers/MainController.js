/**
 * ControllerController
 *
 * @description :: Server-side logic for managing controllers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `ControllerController.homePage()`
   */
  homePage: function (req, res) {
    // if logged in, show activity stream
    if (req.session.user) {
//       res.view('static/homepage', {title: "Da Homepage"});
      res.view('static/homepage', {
        pageTitle: 'Home'
      });
    }
    // return index page and let angular.js construct the page
   // res.view('home/index');
    res.view('static/homepage', {
        pageTitle: 'Home'
    });
  }
};

