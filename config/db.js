import mysql from "mysql2/promise";

export const db = await mysql.createPool({
    host: "localhost",
    user: "student",
    password: "Str0ngP@ssw0rd!",
    database: "losningsforslag",
});
