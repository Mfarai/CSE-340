const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const invCont = {};

invCont.login_get = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/account-login", {
      title: "Account sign-in",
      nav,
    });
  } catch (error) {
    next(error);
  }
};

invCont.register_get = async function (req, res, next) {
  let errors = null;
  try {
    let nav = await utilities.getNav();
    res.render("account/account-reg", {
      title: "Register Account",
      errors: errors || [],
      nav,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * logged in view
 */
invCont.login = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Signed-in",
      nav,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
*  Process Registration
* ***************************************/
invCont.registerAccount = async function (req, res, next) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  let nav = await utilities.getNav(); // corrected the model name
  try {
    const results = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    );
    if (results) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      res.render("account/account-login", {
        title: "Account sign-in",
        nav,
      });
    } else {
      req.flash("error", "Failed to add inventory.");
      res.render("account/account-reg", { nav, errors: ["Failed to register account."] });
    }
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Process login request
 * ************************************ */
invCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
};

module.exports = invCont;