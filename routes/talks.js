import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

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
