import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "db", "custom.db");

function checkDb() {
  if (!fs.existsSync(dbPath)) {
    console.log("Database file does not exist at:", dbPath);
    return;
  }

  const fd = fs.openSync(dbPath, "r");
  const buffer = Buffer.alloc(16);
  fs.readSync(fd, buffer, 0, 16, 0);
  fs.closeSync(fd);

  const header = buffer.toString("utf-8", 0, 15);
  console.log("File Header:", header);

  if (header.startsWith("SQLite format 3")) {
    console.log("Confirmed: db/custom.db is a SQLite database!");
  } else {
    console.log("db/custom.db is NOT a SQLite database.");
  }
}

checkDb();
