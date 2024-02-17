const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accController = require("../controllers/accountsController");


// GET /account/login
router.get('/login', accController.login_get);

// Process the login request
router.post("/login", accController.accountLogin);

//process logged in view
router.get("/login", utilities.checkLogin, utilities.handleErrors(accController.login))

//process reg view
router.get('/account-reg', accController.register_get);

// Process the registration data
router.post("/account-reg", accController.registerAccount)


module.exports = router;