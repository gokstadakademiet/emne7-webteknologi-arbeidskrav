import express from "express";
// * Vi bytter ut mysql med mysql2 fordi mysql2 har støtte for async/await
// * og vi kan bruke mysql2/promise for å få støtte for promises
import mysql from "mysql2/promise";

const PORT = 3000 || process.env.PORT;

const app = express();

app.use(express.json());

const db = await mysql.createConnection({
    host: "localhost",
    user: "student",
    password: "Str0ngP@ssw0rd!",
    database: "losningsforslag",
});

// * Her lager vi en enkel rute for å hente ut alle speakers fra databasen
app.get("/speakers", async (req, res) => {
    const sql = "SELECT * FROM speakers";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
});

// * Her lager vi en rute for å hente ut en spesifikk speaker fra databasen
app.get("/speakers/:id", async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM speakers where id = ?";
    const [rows] = await db.query(sql, [id]);
    res.status(200).json(rows);
});

app.post("/speakers", async (req, res) => {
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

app.put("/speakers/:id", async (req, res) => {
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

app.delete("/speakers/:id", async (req, res) => {
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

// ? CRUD for rooms

app.get("/rooms", async (req, res) => {
    const sql = "SELECT * FROM rooms";
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
});

app.get("/rooms/:id", async (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM rooms WHERE id = ?";
    const [rows] = await db.query(sql, [id]);
    res.status(200).json(rows);
});

app.post("/rooms", async (req, res) => {
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

app.put("/rooms/:id", async (req, res) => {
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

app.delete("/rooms/:id", async (req, res) => {
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

// ? CRUD for talks

app.get("/talks", async (req, res) => {
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

app.get("/talks/:id", async (req, res) => {
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

app.post("/talks", async (req, res) => {
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

app.put("/talks/:id", async (req, res) => {
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

app.delete("/talks/:id", async (req, res) => {
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

// ? Her starter vi serveren

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
