import * as dotenv from "dotenv";
dotenv.config();

const mongoose = require("mongoose");
const { User } = require("../../lib/models/User");
const { connectToDatabase } = require("../../lib/db");

async function runMigration() {
  console.log("Connecting to database...");
  await connectToDatabase();

  console.log("Connected. Starting migration to add reset password fields...");

  try {
    const result = await User.updateMany(
      { resetPasswordToken: { $exists: false } },
      { $set: { resetPasswordToken: null, resetPasswordExpires: null } }
    );
    
    console.log(`Migration successful. Updated ${result.modifiedCount} users.`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

runMigration();
