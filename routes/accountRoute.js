const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accController = require("../controllers/accountsController");
const regValidate = require('../utilities/account-validation')


// GET /account/login
router.get('/login', accController.login_get);

// Process the login request
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accController.accountLogin)
)

//process logged in view
router.get("/account-management", utilities.checkLogin, accController.login )

// update view
router.get("/update", accController.accountUpdate);

//process reg view
router.get('/account-reg', accController.register_get);

// Process the registration data
// Process the registration data
router.post(
    "/account-reg",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
)

// log out route
router.get("/logout", accController.accountLogout)

module.exports = router;