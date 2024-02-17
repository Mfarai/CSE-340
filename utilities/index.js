const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = (data) => {
  let grid;
  if (data.length > 0) {
    grid = '<div class="vehicle-detail-container">';
    data.forEach((vehicle) => {
      grid += '<div class="vehicle-detail">';
      grid += `<h1 title="${vehicle.inv_make} ${vehicle.inv_model}">${vehicle.inv_make} ${vehicle.inv_model}</h1>`;
      grid += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`; 
      grid += '<div class="vehicle-info">';
      grid += `<p>Year: ${vehicle.inv_year}</p>`;
      grid += `<p>Color: ${vehicle.inv_color}</p>`;
      grid += `<p>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`;
      grid += `<p>Mileage: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>`;
      grid += '</div>';
      grid += '<div class="vehicle-description">';
      grid += `<h2>Description:</h2>`;
      grid += `<p>${vehicle.inv_description}</p>`;
      grid += '</div>';
      grid += '</div>';
    });
    grid += '</div>';
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/***
 * build the drop down menu
 */
Util.buildClassificationDropdown = async function () {
  let dropdown = '<select id="classification_id" name="classification_id" class="form-control" required>' +
                 '<option value="">Select Classification</option>' +
                 '';
    let classifications = await invModel.getClassifications();
    classifications.rows.forEach((classification) => {
      dropdown += '<option value="' + classification.classification_id + '" selected="selected">'
      dropdown += classification.classification_name
      dropdown += "</option>"
    });
  dropdown += '</select>';
  return dropdown;
}

/****************************
 * Middleware for handling errors
 * wrap in other functions for error handling
 *****/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)) .catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/account-login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util

