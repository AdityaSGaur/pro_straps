import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";

const sqliteDbPath = path.join(process.cwd(), "db", "custom.db");
const jsonDbPath = path.join(process.cwd(), "src", "data", "db.json");

function migrate() {
  if (!fs.existsSync(sqliteDbPath)) {
    console.log("No custom.db SQLite file found at:", sqliteDbPath);
    return;
  }

  const db = new DatabaseSync(sqliteDbPath);

  // List all tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as any[];
  console.log("Found SQLite tables:", tables.map(t => t.name));

  // Check if Address table exists
  const hasAddress = tables.some(t => t.name === "Address");
  const hasUser = tables.some(t => t.name === "User");

  if (!hasAddress) {
    console.log("No Address table found in custom.db!");
    return;
  }

  // Load existing JSON database
  let jsonDb: any = { users: [], addresses: [], orders: [] };
  if (fs.existsSync(jsonDbPath)) {
    try {
      jsonDb = JSON.parse(fs.readFileSync(jsonDbPath, "utf-8"));
    } catch {
      // ignore
    }
  }

  console.log(`Current JSON DB has:
   - Users: ${jsonDb.users?.length || 0}
   - Addresses: ${jsonDb.addresses?.length || 0}
   - Orders: ${jsonDb.orders?.length || 0}`);

  // Fetch users from SQLite
  let sqliteUsers: any[] = [];
  if (hasUser) {
    sqliteUsers = db.prepare("SELECT * FROM User").all() as any[];
    console.log(`Found ${sqliteUsers.length} users in SQLite.`);
  }

  // Fetch addresses from SQLite
  const sqliteAddresses = db.prepare("SELECT * FROM Address").all() as any[];
  console.log(`Found ${sqliteAddresses.length} addresses in SQLite.`);

  // Merge users
  sqliteUsers.forEach((su: any) => {
    const exists = jsonDb.users.some((ju: any) => ju.email.toLowerCase() === su.email.toLowerCase());
    if (!exists) {
      jsonDb.users.push({
        id: su.id,
        name: su.name,
        email: su.email.toLowerCase(),
        phone: su.phone,
        passwordHash: su.passwordHash || null,
        role: su.role || "CUSTOMER",
        isActive: su.isActive === undefined ? true : Boolean(su.isActive),
        createdAt: su.createdAt || new Date().toISOString(),
      });
    }
  });

  // Merge addresses
  sqliteAddresses.forEach((sa: any) => {
    const exists = jsonDb.addresses.some((ja: any) => ja.id === sa.id);
    if (!exists) {
      jsonDb.addresses.push({
        id: sa.id,
        userId: sa.userId,
        label: sa.label,
        street: sa.street,
        city: sa.city,
        state: sa.state,
        postalCode: sa.postalCode,
        country: sa.country || "India",
        phone: sa.phone,
        deliveryInstructions: sa.deliveryInstructions,
        isDefault: sa.isDefault === 1 || sa.isDefault === true,
        createdAt: sa.createdAt || new Date().toISOString(),
      });
    }
  });

  // Save merged DB back to db.json
  fs.writeFileSync(jsonDbPath, JSON.stringify(jsonDb, null, 2), "utf-8");
  console.log("✅ Successfully merged SQLite data into db.json!");
  console.log(`New JSON DB totals:
   - Users: ${jsonDb.users.length}
   - Addresses: ${jsonDb.addresses.length}`);
}

migrate();
