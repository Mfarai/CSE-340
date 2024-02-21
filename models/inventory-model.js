const pool = require("../database/index")
const { Sequelize, DataTypes } = require('sequelize')

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

module.exports = {getClassifications}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error\n " + error)
    return null;
  }
}

/**********************************
 * Post new classification to database
*************************************/
async function addNewClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification(classification_name) VALUES ($1);"
   
    return await pool.query(sql, [classification_name])
  } catch (error) {
    console.log(error.message)
  }
} 

/**
 * add inventory
 */
async function addNewInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id) {
  try {
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price =$7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *;"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id])
  } catch (error) { 
    console.log(error.message)
  }
}

async function searchInventory(searchTerm) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_make ILIKE $1 OR inv_model ILIKE $1 OR inv_description ILIKE $1`,
      [`%${searchTerm}%`]
    );
    return data.rows
  } catch (error) {
    console.error("searchInventory error\n " + error);
    return null;
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, addNewClassification, addNewInventory, searchInventory};
