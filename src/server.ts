import app from "./app";
import  {sequelize}  from "./config/database";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {

    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(error);
  }
}

start();