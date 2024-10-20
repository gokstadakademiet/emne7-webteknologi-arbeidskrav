import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

router.get("/", async (req, res) => {
    const sql = "SELECT * FROM rooms";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM rooms WHERE id = ?";
    const [rows] = await db.query(sql, [id]);
    res.status(200).json(rows);
});

router.post("/", async (req, res) => {
    const { name, capacity } = req.body;

    try {
        const sql = "INSERT INTO rooms SET name = ?, capacity = ?";
        const [{ insertId }] = await db.execute(sql, [name, capacity]);
        res.status(201).send({ id: insertId, name, capacity });
    } catch (err) {
        console.log({
            code: err.code,
            statement: err.sql,
            message: err.sqlMessage,
        });
        res.status(500).json({ error: true, message: "An error occured" });
    }
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, capacity } = req.body;

    try {
        const sql = "UPDATE rooms SET name = ?, capacity = ? WHERE id = ?";
        await db.execute(sql, [name, capacity, id]);
        res.status(200).json({ id, name, capacity });
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
        const sql = "DELETE FROM rooms WHERE id = ?";
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
