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
module.exports = invCont