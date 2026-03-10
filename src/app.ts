import express from "express";
import identifyRoutes from "./routes/identify.routes";

const app = express();

app.use(express.json());

app.use("/", identifyRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "BiteSpeed Identity Reconciliation API is running"
  });
});

export default app;