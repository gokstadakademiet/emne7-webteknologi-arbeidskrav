import express from "express";
import rooms from "./routes/rooms.js";
import speakers from "./routes/speakers.js";
import talks from "./routes/talks.js";
// * Vi bytter ut mysql med mysql2 fordi mysql2 har støtte for async/await
// * og vi kan bruke mysql2/promise for å få støtte for promises

const PORT = 3000 || process.env.PORT;

const app = express();

app.use(express.json());

app.use("/talks", talks);
app.use("/rooms", rooms);
app.use("/speakers", speakers);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
