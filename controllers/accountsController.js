const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
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

invCont.login = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/account-management", {
      title: "Signed-in",
      nav,
    });
  } catch (error) {
    next(error);
  }
};

invCont.accountUpdate = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/update", {
      title: "update details",
      nav,
    });
  } catch (error) {
    next(error);
  }
};

invCont.registerAccount = async function (req, res, next) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  let nav = await utilities.getNav();
  try {
    const hashedPassword = await bcrypt.hashSync(account_password, 10);
    const results = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );
    if (results) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      res.render("account/account-login", {
        title: "Account sign-in",
        nav,
      });
    } else {
      req.flash("error", "Failed to add inventory.");
      res.render("account/account-reg", {
        nav,
        errors: ["Failed to register account."],
      });
    }
  } catch (error) {
    next(error);
  }
};

invCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  console.log(JSON.stringify(accountData));
  if (!accountData) {
    console.log('redirecting to account login')
    res.status(404).render("account/account-login", {
      title: "Login",
      nav,
      errors: ["Account not found."],
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      console.log('passwords matched')
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3600 * 1000})
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
        return res.redirect("/account/account-management");
    }else{
      console.log('passwords did not match');
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: ["Invalid password."],
        account_email,
      });
    }
  } catch (error) {
    return new Error('Access Forbidden')
}}

invCont.accountLogout = async function (req, res, next) {
  try {
    res.clearCookie( 'jwt' )
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;