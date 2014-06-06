/**
 * i18n Translator
 *
 * @module      :: Policy
 * @description :: Simple policy to translate i18n strings
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  
  /*TODO: Check the users chosen language*/
  res.setLocale('en');

  return next();
};
