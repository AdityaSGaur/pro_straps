import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "src", "data", "db.json");

export interface MockUser {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  passwordHash?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface MockAddress {
  id: string;
  userId: string;
  label: string | null;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string | null;
  deliveryInstructions: string | null;
  isDefault: boolean;
  createdAt: string;
}

export interface MockOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
  userId: string | null;
  shippingAddress: any;
  items: any[];
}

export interface FileDB {
  users: MockUser[];
  addresses: MockAddress[];
  orders: MockOrder[];
}

function ensureDbFile() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ users: [], addresses: [], orders: [] }, null, 2),
      "utf-8"
    );
  }
}

export function readDb(): FileDB {
  ensureDbFile();
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read file database, returning empty structure:", err);
    return { users: [], addresses: [], orders: [] };
  }
}

export function writeDb(data: FileDB) {
  ensureDbFile();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to file database:", err);
  }
}

// ─── User Helper Methods ──────────────────────────────────────────────────

export function getOrCreateUser(email: string, name?: string | null): MockUser {
  const db = readDb();
  const cleanEmail = email.toLowerCase().trim();
  let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    user = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name: name || null,
      email: cleanEmail,
      phone: null,
      role: "CUSTOMER",
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    writeDb(db);
  }
  return user;
}

export function createUserInFile(userData: Omit<MockUser, "id" | "createdAt">): MockUser {
  const db = readDb();
  const newUser: MockUser = {
    ...userData,
    id: `usr_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

export function updateUser(id: string, name?: string | null, phone?: string | null): MockUser | null {
  const db = readDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  if (name !== undefined) db.users[index].name = name;
  if (phone !== undefined) db.users[index].phone = phone;

  writeDb(db);
  return db.users[index];
}

// ─── Addresses Helper Methods ─────────────────────────────────────────────

export function getUserAddresses(userId: string): MockAddress[] {
  const db = readDb();
  return db.addresses
    .filter((a) => a.userId === userId)
    .sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}

export function addAddress(userId: string, addressData: Omit<MockAddress, "id" | "userId" | "createdAt">): MockAddress {
  const db = readDb();

  // If setting default, unset other defaults
  if (addressData.isDefault) {
    db.addresses.forEach((a) => {
      if (a.userId === userId) a.isDefault = false;
    });
  }

  const newAddress: MockAddress = {
    ...addressData,
    id: `addr_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    createdAt: new Date().toISOString(),
  };

  db.addresses.push(newAddress);
  writeDb(db);
  return newAddress;
}

// ─── Orders Helper Methods ────────────────────────────────────────────────

export function getUserOrders(userId: string | null): MockOrder[] {
  const db = readDb();
  if (!userId) return [];
  return db.orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createOrder(orderData: Omit<MockOrder, "id" | "orderNumber" | "status" | "createdAt">): MockOrder {
  const db = readDb();
  const newOrder: MockOrder = {
    ...orderData,
    id: `ord_${Math.random().toString(36).substr(2, 9)}`,
    orderNumber: `PS-${Math.floor(100000 + Math.random() * 900000)}`,
    status: "CONFIRMED", // Auto-confirm mock order
    createdAt: new Date().toISOString(),
  };

  db.orders.push(newOrder);
  writeDb(db);
  return newOrder;
}
