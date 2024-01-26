const {Pool} = require("pg")
require("dotenv").config()
/*******************************
 * Connection pool
 * SSL object needed for testing the local app
 * but will cause problem in the production environment
 * if- else will make determination which to use
 */
let pool
if (process.env.NODE_ENV == "development"){
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    })

    // added for troubleshooting queries
    // during development

    module.exports = {
        async query(text, params){
            try{
                const res =await pool.query(text, params)
                console.log("executed query", {text})
                return res
            }catch (error){
                console.error("error in query", {text})
                throw error
            }
        },
    } 
    }else {
        pool = new pool({
            connectionString: process.env.DATABASE_URL,
        })
        module.exports = pool
    }
    
