import express from "express";
import cors from "cors";
import { errorHandling } from "./middlewares/error-handling";

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  return res.json({ message: "Ok" });
});

app.use(errorHandling)
export { app };
