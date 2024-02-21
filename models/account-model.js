const pool = require("../database/index");

async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  // Validate input
  try {
    // Insert the new account into the database
    const sql =
      "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
      "Client",
    ];
    return await pool.query(sql, values);
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}

/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email]
    );
    if (result.rowCount === 0) {
      return null; // Return null if no matching email found
    }
    return result.rows[0];
  } catch (error) {
    console.error(error.message);
    return null; // Return null if there's an error
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = { registerAccount, getAccountByEmail, checkExistingEmail};