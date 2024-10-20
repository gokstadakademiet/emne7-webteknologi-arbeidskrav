import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();
/**
 * @swagger
 * /speakers:
 *   get:
 *     summary: Retrieve a list of speakers
 *     responses:
 *       200:
 *         description: A list of speakers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   company:
 *                     type: string
 */
router.get("/", async (req, res) => {
    const sql = "SELECT * FROM speakers";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
});

/**
 * @swagger
 * /speakers/{id}:
 *   get:
 *     summary: Retrieve a specific speaker
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single speaker
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 company:
 *                   type: string
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM speakers where id = ?";
    const [rows] = await db.query(sql, [id]);
    res.status(200).json(rows);
});

/**
 * @swagger
 * /speakers:
 *   post:
 *     summary: Create a new speaker
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               company:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created speaker
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 company:
 *                   type: string
 */
router.post("/", async (req, res) => {
    const { name, email, company } = req.body;

    try {
        const sql = "INSERT INTO speakers SET name = ?, email = ?, company = ?";
        const [{ insertId }] = await db.execute(sql, [name, email, company]);
        res.status(201).send({ id: insertId, name, email, company });
    } catch (err) {
        console.log({
            code: err.code,
            statement: err.sql,
            message: err.sqlMessage,
        });
        res.status(500).json({
            error: true,
            message: "An error occured",
        });
    }
});

/**
 * @swagger
 * /speakers/{id}:
 *   put:
 *     summary: Update a speaker
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               company:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated speaker
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 company:
 *                   type: string
 */
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

/**
 * @swagger
 * /speakers/{id}:
 *   delete:
 *     summary: Delete a speaker
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: No content
 */
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
