const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.getInventoryItems = async function (req, res, next) {
  try {
    const invId = req.params.id
    const vehicle = await invModel.getInventoryItem(classification_id)
    let nav = await utilities.getNav()
    const grid = await utilities.buildClassificationGrid([])
    res.render('./inventory/classification', {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      'vehicle-title': `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicles: [vehicle],
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

invCont.displayInventoryManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Manage Inventory",
      nav,
    })
  } catch (error) {
    next(error)
  }
}

invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  } catch (error) {
    next(error)
  }
}

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  try {
    const results = await invModel.addNewClassification(classification_name);
    const nav = await utilities.getNav(); // corrected the model name
    if (results) {
      req.flash("notice", "Classification added successfully." );
      res.render("inventory/management", { nav, title: "Add Classification",});
    } else {
      req.flash("error", { text: "Failed to add classification." });
      res.render("inventory/add-classification", { nav, title: "Add Classification", });
    }
  } catch (error) {
    next(error);
  }
}

invCont.addInventoryGet = async function (req, res, next) {
  try {
    let dropdown = await utilities.buildClassificationDropdown();
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      dropdown
    });
  } catch (error) {
    next(error);
  }
}

invCont.addInventoryPost = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body;
  try {
    const results = await invModel.addNewInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);
    const dropdown = await utilities.buildClassificationDropdown();
    const nav = await utilities.getNav(); // corrected the model name
    if (results) {
      req.flash("notice", "Inventory added successfully." );
      res.redirect("/inv/");
    } else {
      req.flash("error", "Failed to add inventory." );
      res.render("inventory/add-inventory", { nav, dropdown, title: "Add Inventory", });
    }
  } catch (error) {
    next(error);
  }
}

invCont.searchInventoryGet = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/search-inventory", {
      title: "search inventory",
      nav,
    });
  } catch (error) {
    next(error);
  }
}

invCont.searchInventoryPost = async function (req, res, next ){
  const { searchTerm } = req.body;
  try {
    const inventoryItems = await invModel.searchInventory(searchTerm);
    const grid = await utilities.buildClassificationGrid([inventoryItems])
    let nav = await utilities.getNav();
    req.flash("notice", "search successfully and the results." );
    res.render("inventory/search-results", {
      title: `Search Results for "${searchTerm}"`,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
}


module.exports = invCont


