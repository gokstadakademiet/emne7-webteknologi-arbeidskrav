import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

// * Her lager vi en enkel rute for å hente ut alle speakers fra databasen
router.get("/", async (req, res) => {
    const sql = "SELECT * FROM speakers";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
});

// * Her lager vi en rute for å hente ut en spesifikk speaker fra databasen
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM speakers where id = ?";
    const [rows] = await db.query(sql, [id]);
    res.status(200).json(rows);
});

router.post("/", async (req, res) => {
    // * Her henter vi ut de feltene vi trenger fra req.body
    const { name, email, company } = req.body;

    // * Her bruker vi en try-catch block fordi database spørringer kan feile
    try {
        const sql = "INSERT INTO speakers SET name = ?, email = ?, company = ?";
        const [{ insertId }] = await db.execute(sql, [name, email, company]);
        res.status(201).send({ id: insertId, name, email, company });
    } catch (err) {
        // * Her vil vi logge til logge tjenesten vår hvilken feil vi fikk,
        // * i dette tilfellet bruker vi console.log men denne kan erstattes med en logge tjeneste som f.eks. slf4j
        console.log({
            code: err.code,
            statement: err.sql,
            message: err.sqlMessage,
        });

        // * Til klienten svarer vi med en 500 statuskode og en feilmelding men vi sier ikke hva feilen er
        res.status(500).json({
            error: true,
            message: "An error occured",
        });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email, company } = req.body;

    try {
        const sql =
            "update speakers SET name = ?, email = ?, company = ? WHERE id = ?";
        await db.execute(sql, [name, email, company, id]);
        res.status(200).json({ id, name, email, company });
    } catch (err) {
        console.log({
            code: err.code,
            statement: err.sql,
            message: err.sqlMessage,
        });
        res.status(500).json({ error: true, message: "An error occured" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const sql = "DELETE FROM speakers WHERE id = ?";
        await db.execute(sql, [id]);
        res.status(204).send();
    } catch (err) {
        console.log({
            code: err.code,
            statement: err.sql,
            message: err.sqlMessage,
        });
        res.status(500).json({ error: true, message: "An error occured" });
    }
});

export default router;
