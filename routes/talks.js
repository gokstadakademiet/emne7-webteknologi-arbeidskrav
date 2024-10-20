import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();
/**
 * @swagger
 * /talks:
 *   get:
 *     summary: Retrieve a list of talks
 *     responses:
 *       200:
 *         description: A list of talks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   start_time:
 *                     type: string
 *                     format: date-time
 *                   end_time:
 *                     type: string
 *                     format: date-time
 *                   duration:
 *                     type: integer
 *                   room_id:
 *                     type: integer
 *                   room_name:
 *                     type: string
 *                   room_capacity:
 *                     type: integer
 *                   speaker_id:
 *                     type: integer
 *                   speaker_name:
 *                     type: string
 *                   speaker_email:
 *                     type: string
 *                   speaker_company:
 *                     type: string
 */
router.get("/", async (req, res) => {
    try {
        const sql = `SELECT t.id
            , t.title
            , t.start_time
            , t.end_time
            , abs(time_to_sec(timediff(start_time, end_time))) div 60 as duration
            , t.room_id as room_id
            , r.name as room_name
            , r.capacity as room_capacity
            , t.speaker_id as speaker_id
            , s.name as speaker_name
            , s.email as speaker_email
            , s.company as speaker_company
            FROM talks t 
            join rooms r on r.id = t.room_id
            join speakers s on s.id = t.speaker_id`;
        const [rows] = await db.query(sql);
        res.status(200).json(rows);
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
 * /talks/{id}:
 *   get:
 *     summary: Retrieve a single talk by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single talk
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 start_time:
 *                   type: string
 *                   format: date-time
 *                 end_time:
 *                   type: string
 *                   format: date-time
 *                 duration:
 *                   type: integer
 *                 room_id:
 *                   type: integer
 *                 room_name:
 *                   type: string
 *                 room_capacity:
 *                   type: integer
 *                 speaker_id:
 *                   type: integer
 *                 speaker_name:
 *                   type: string
 *                 speaker_email:
 *                   type: string
 *                 speaker_company:
 *                   type: string
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const sql = `SELECT t.id
            , t.title
            , t.start_time
            , t.end_time
            , abs(time_to_sec(timediff(start_time, end_time))) div 60 as duration
            , t.room_id as room_id
            , r.name as room_name
            , r.capacity as room_capacity
            , t.speaker_id as speaker_id
            , s.name as speaker_name
            , s.email as speaker_email
            , s.company as speaker_company
            FROM talks t 
            join rooms r on r.id = t.room_id
            join speakers s on s.id = t.speaker_id
            WHERE t.id = ?`;
        const [rows] = await db.query(sql, [id]);
        res.status(200).json(rows);
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
 * /talks:
 *   post:
 *     summary: Create a new talk
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               room_id:
 *                 type: integer
 *               speaker_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: The created talk
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 start_time:
 *                   type: string
 *                   format: date-time
 *                 end_time:
 *                   type: string
 *                   format: date-time
 *                 room_id:
 *                   type: integer
 *                 speaker_id:
 *                   type: integer
 */
router.post("/", async (req, res) => {
    const { title, start_time, end_time, room_id, speaker_id } = req.body;

    try {
        const sql =
            "INSERT INTO talks SET title = ?, start_time = ?, end_time = ?, room_id = ?, speaker_id = ?";
        const [{ insertId }] = await db.execute(sql, [
            title,
            start_time,
            end_time,
            room_id,
            speaker_id,
        ]);
        res.status(201).send({
            id: insertId,
            title,
            start_time,
            end_time,
            room_id,
            speaker_id,
        });
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
 * /talks/{id}:
 *   put:
 *     summary: Update an existing talk
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
 *               title:
 *                 type: string
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               room_id:
 *                 type: integer
 *               speaker_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The updated talk
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 start_time:
 *                   type: string
 *                   format: date-time
 *                 end_time:
 *                   type: string
 *                   format: date-time
 *                 room_id:
 *                   type: integer
 *                 speaker_id:
 *                   type: integer
 */
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, start_time, end_time, room_id, speaker_id } = req.body;

    try {
        const sql =
            "UPDATE talks SET title = ?, start_time = ?, end_time = ?, room_id = ?, speaker_id = ? WHERE id = ?";
        await db.execute(sql, [
            title,
            start_time,
            end_time,
            room_id,
            speaker_id,
            id,
        ]);
        res.status(200).json({
            id,
            title,
            start_time,
            end_time,
            room_id,
            speaker_id,
        });
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
 * /talks/{id}:
 *   delete:
 *     summary: Delete a talk by ID
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
        const sql = "DELETE FROM talks WHERE id = ?";
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
