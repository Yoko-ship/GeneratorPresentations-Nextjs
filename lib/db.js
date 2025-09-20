import { Pool } from "pg";


export const pool = new Pool({
  connectionString:process.env.NEXT_PUBLIC_DATABASE,
  ssl:{
    rejectUnauthorized:false
  }
})


 
// export const createTable = async () => {
//   await sql`CREATE TABLE IF NOT EXISTS presentation(
//         ID SERIAL PRIMARY KEY,
//         name VARCHAR NOT NULL,
//         email VARCHAR NOT NULL,
//         password VARCHAR NOT NULL
//     )`;
//   console.log("Таблица успешно создана");
// };


// export const insertIntoTable = async (firstName, lastName, email, password) => {
//   const result =
//     await sql`INSERT INTO presentation(firstname,lastname,email,password) VALUES(${firstName},${lastName},${email},${password}) RETURNING *`;
//     return result[0]
// };

// export default sql
