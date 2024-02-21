// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");

// get management view
router.get("/", invController.displayInventoryManagementView);

// build and post the classification to the nav
router.get("/add-classification", invController.buildAddClassification);

router.post("/add-classification", invController.addClassification);

// create and pos the inventory
router.get("/add-inventory", invController.addInventoryGet);

router.post("/add-inventory", invController.addInventoryPost);

// search inv view
router.get("/search-inventory", invController.searchInventoryGet);

router.post("/search-inventory", invController.searchInventoryPost);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;