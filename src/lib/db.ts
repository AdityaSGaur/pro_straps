import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "src", "data", "db.json");

function ensureDbFile() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify(
        {
          users: [],
          addresses: [],
          orders: [],
          categories: [],
          collections: [],
          products: [],
          productVariants: [],
          productImages: [],
          productCategories: [],
          productCollections: [],
          coupons: [],
          reviews: [],
          watchBrands: [],
          watchModels: [],
          productCompatibilities: [],
          payments: [],
          orderItems: [],
          orderStatusHistories: [],
          couponUsages: [],
          customizations: [],
          newsletterSubscribers: [],
          siteSettings: [],
        },
        null,
        2
      ),
      "utf-8"
    );
  }
}

export function readDb(): any {
  ensureDbFile();
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to read file database:", err);
    return {};
  }
}

export function writeDb(data: any) {
  ensureDbFile();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to file database:", err);
  }
}

// Helper to filter records using Prisma-like where conditions
function matchesWhere(item: any, where: any): boolean {
  if (!where) return true;
  for (const key of Object.keys(where)) {
    const condition = where[key];
    if (key === "AND") {
      if (Array.isArray(condition)) {
        if (!condition.every((subWhere) => matchesWhere(item, subWhere))) return false;
      }
    } else if (key === "OR") {
      if (Array.isArray(condition)) {
        if (!condition.some((subWhere) => matchesWhere(item, subWhere))) return false;
      }
    } else if (key === "NOT") {
      if (Array.isArray(condition)) {
        if (condition.some((subWhere) => matchesWhere(item, subWhere))) return false;
      } else {
        if (matchesWhere(item, condition)) return false;
      }
    } else {
      const val = item[key];
      if (condition && typeof condition === "object" && !(condition instanceof Date)) {
        if ("not" in condition) {
          if (val === condition.not) return false;
        }
        if ("equals" in condition) {
          if (val !== condition.equals) return false;
        }
        if ("in" in condition) {
          if (!Array.isArray(condition.in) || !condition.in.includes(val)) return false;
        }
        if ("notIn" in condition) {
          if (Array.isArray(condition.notIn) && condition.notIn.includes(val)) return false;
        }
        if ("contains" in condition) {
          if (typeof val === "string" && typeof condition.contains === "string") {
            const mode = condition.mode;
            if (mode === "insensitive") {
              if (!val.toLowerCase().includes(condition.contains.toLowerCase())) return false;
            } else {
              if (!val.includes(condition.contains)) return false;
            }
          } else return false;
        }
        if ("gte" in condition) {
          if (val === undefined || val === null || val < condition.gte) return false;
        }
        if ("lte" in condition) {
          if (val === undefined || val === null || val > condition.lte) return false;
        }
        if ("gt" in condition) {
          if (val === undefined || val === null || val <= condition.gt) return false;
        }
        if ("lt" in condition) {
          if (val === undefined || val === null || val >= condition.lt) return false;
        }
      } else {
        if (val !== condition) return false;
      }
    }
  }
  return true;
}

// Helper to sort records
function sortItems(items: any[], orderBy: any): any[] {
  const orders = Array.isArray(orderBy) ? orderBy : [orderBy];
  return [...items].sort((a, b) => {
    for (const order of orders) {
      const key = Object.keys(order)[0];
      const dir = order[key];
      let valA = a[key];
      let valB = b[key];

      if (valA instanceof Date) valA = valA.getTime();
      if (valB instanceof Date) valB = valB.getTime();
      if (typeof valA === "string" && !isNaN(Date.parse(valA)) && valA.includes("-")) {
        valA = new Date(valA).getTime();
      }
      if (typeof valB === "string" && !isNaN(Date.parse(valB)) && valB.includes("-")) {
        valB = new Date(valB).getTime();
      }

      if (valA === undefined || valA === null) return dir === "asc" ? 1 : -1;
      if (valB === undefined || valB === null) return dir === "asc" ? -1 : 1;

      if (valA < valB) return dir === "asc" ? -1 : 1;
      if (valA > valB) return dir === "asc" ? 1 : -1;
    }
    return 0;
  });
}

// Helper maps for relations
const RELATIONSHIPS: Record<string, (item: any, dbData: any, include: any) => void> = {
  category: (item, dbData, include) => {
    if (include._count?.select?.products) {
      const count = dbData.productCategories.filter((pc: any) => pc.categoryId === item.id).length;
      item._count = { products: count };
    }
  },
  collection: (item, dbData, include) => {
    if (include._count?.select?.products) {
      const count = dbData.productCollections.filter((pc: any) => pc.collectionId === item.id).length;
      item._count = { products: count };
    }
  },
  product: (item, dbData, include) => {
    if (include.variants) {
      let v = dbData.productVariants.filter((pv: any) => pv.productId === item.id);
      if (include.variants.orderBy) {
        v = sortItems(v, include.variants.orderBy);
      }
      item.variants = v;
    }
    if (include.images) {
      let img = dbData.productImages.filter((pi: any) => pi.productId === item.id);
      if (include.images.orderBy) {
        img = sortItems(img, include.images.orderBy);
      }
      item.images = img;
    }
    if (include.categories) {
      item.categories = dbData.productCategories
        .filter((pc: any) => pc.productId === item.id)
        .map((pc: any) => {
          const res = { ...pc };
          if (include.categories.include?.category) {
            res.category = dbData.categories.find((c: any) => c.id === pc.categoryId);
          }
          return res;
        });
    }
    if (include.collections) {
      item.collections = dbData.productCollections
        .filter((pc: any) => pc.productId === item.id)
        .map((pc: any) => {
          const res = { ...pc };
          if (include.collections.include?.collection) {
            res.collection = dbData.collections.find((c: any) => c.id === pc.collectionId);
          }
          return res;
        });
    }
    if (include.reviews) {
      item.reviews = dbData.reviews.filter((r: any) => r.productId === item.id);
    }
  },
  order: (item, dbData, include) => {
    if (include.user) {
      const u = dbData.users.find((user: any) => user.id === item.userId);
      if (u) {
        if (include.user.select) {
          const selected: any = {};
          for (const k of Object.keys(include.user.select)) {
            if (include.user.select[k]) selected[k] = u[k];
          }
          item.user = selected;
        } else {
          item.user = u;
        }
      } else {
        item.user = null;
      }
    }
    if (include.items) {
      item.items = dbData.orderItems.filter((oi: any) => oi.orderId === item.id);
    }
    if (include.shippingAddress) {
      item.shippingAddress = dbData.addresses.find((a: any) => a.id === item.shippingAddressId) || null;
    }
    if (include.billingAddress) {
      item.billingAddress = dbData.addresses.find((a: any) => a.id === item.billingAddressId) || null;
    }
    if (include.statusHistory) {
      let sh = dbData.orderStatusHistories.filter((osh: any) => osh.orderId === item.id);
      if (include.statusHistory.orderBy) {
        sh = sortItems(sh, include.statusHistory.orderBy);
      }
      item.statusHistory = sh;
    }
  },
  review: (item, dbData, include) => {
    if (include.product) {
      item.product = dbData.products.find((p: any) => p.id === item.productId) || null;
    }
    if (include.user) {
      item.user = dbData.users.find((u: any) => u.id === item.userId) || null;
    }
  },
  productCategory: (item, dbData, include) => {
    if (include.category) {
      item.category = dbData.categories.find((c: any) => c.id === item.categoryId) || null;
    }
    if (include.product) {
      item.product = dbData.products.find((p: any) => p.id === item.productId) || null;
    }
  },
  productCollection: (item, dbData, include) => {
    if (include.collection) {
      item.collection = dbData.collections.find((c: any) => c.id === item.collectionId) || null;
    }
    if (include.product) {
      item.product = dbData.products.find((p: any) => p.id === item.productId) || null;
    }
  },
};

const PLURAL_MAP: Record<string, string> = {
  product: "products",
  productImage: "productImages",
  productVariant: "productVariants",
  variantImage: "variantImages",
  productCategory: "productCategories",
  productCollection: "productCollections",
  watchBrand: "watchBrands",
  watchModel: "watchModels",
  productCompatibility: "productCompatibilities",
  user: "users",
  account: "accounts",
  session: "sessions",
  address: "addresses",
  cartItem: "cartItems",
  wishlistItem: "wishlistItems",
  order: "orders",
  orderItem: "orderItems",
  orderStatusHistory: "orderStatusHistories",
  payment: "payments",
  coupon: "coupons",
  couponUsage: "couponUsages",
  review: "reviews",
  reviewImage: "reviewImages",
  customization: "customizations",
  newsletterSubscriber: "newsletterSubscribers",
  siteSetting: "siteSettings",
  category: "categories",
  collection: "collections",
};

class MockPrismaTable {
  private modelName: string;
  private pluralName: string;

  constructor(modelName: string) {
    this.modelName = modelName;
    this.pluralName = PLURAL_MAP[modelName] || modelName + "s";
  }

  private readTable(): any[] {
    const data = readDb();
    if (!data[this.pluralName]) {
      data[this.pluralName] = [];
    }
    return data[this.pluralName];
  }

  private writeTable(items: any[]) {
    const data = readDb();
    data[this.pluralName] = items;
    writeDb(data);
  }

  async findMany(args?: any) {
    let items = this.readTable();

    // Filter
    if (args?.where) {
      items = items.filter((item) => matchesWhere(item, args.where));
    }

    // Order
    if (args?.orderBy) {
      items = sortItems(items, args.orderBy);
    }

    // Skip / Take
    if (args?.skip !== undefined) {
      items = items.slice(args.skip);
    }
    if (args?.take !== undefined) {
      items = items.slice(0, args.take);
    }

    // Include relations
    items = items.map((item) => {
      const cloned = { ...item };
      if (args?.include) {
        const dbData = readDb();
        const resolver = RELATIONSHIPS[this.modelName];
        if (resolver) {
          resolver(cloned, dbData, args.include);
        }
      }
      return cloned;
    });

    return items;
  }

  async findFirst(args?: any) {
    const items = await this.findMany(args);
    return items[0] || null;
  }

  async findUnique(args?: any) {
    return this.findFirst(args);
  }

  async count(args?: any) {
    let items = this.readTable();
    if (args?.where) {
      items = items.filter((item) => matchesWhere(item, args.where));
    }
    return items.length;
  }

  async aggregate(args?: any) {
    let items = this.readTable();
    if (args?.where) {
      items = items.filter((item) => matchesWhere(item, args.where));
    }
    const result: any = {};
    if (args?._sum) {
      result._sum = {};
      for (const key of Object.keys(args._sum)) {
        if (args._sum[key]) {
          const sum = items.reduce((s, item) => s + (Number(item[key]) || 0), 0);
          result._sum[key] = sum;
        }
      }
    }
    if (args?._avg) {
      result._avg = {};
      for (const key of Object.keys(args._avg)) {
        if (args._avg[key]) {
          const sum = items.reduce((s, item) => s + (Number(item[key]) || 0), 0);
          result._avg[key] = items.length ? sum / items.length : 0;
        }
      }
    }
    return result;
  }

  async create(args: any) {
    const items = this.readTable();
    const prefix =
      this.modelName === "user"
        ? "usr"
        : this.modelName === "order"
        ? "ord"
        : this.modelName === "address"
        ? "addr"
        : this.modelName.substring(0, 4);
    const newId = args.data.id || `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

    const rowData: any = { id: newId };
    for (const key of Object.keys(args.data)) {
      const val = args.data[key];
      if (val && typeof val === "object" && ("create" in val || "createMany" in val || "connect" in val)) {
        continue;
      }
      rowData[key] = val;
    }

    if (!rowData.createdAt) rowData.createdAt = new Date().toISOString();
    if (!rowData.updatedAt) rowData.updatedAt = new Date().toISOString();

    items.push(rowData);
    this.writeTable(items);

    const cloned = { ...rowData };
    if (args.include) {
      const dbData = readDb();
      const resolver = RELATIONSHIPS[this.modelName];
      if (resolver) {
        resolver(cloned, dbData, args.include);
      }
    }
    return cloned;
  }

  async createMany(args: any) {
    const items = this.readTable();
    const dataList = Array.isArray(args.data) ? args.data : [args.data];
    const prefix = this.modelName.substring(0, 4);

    const inserted: any[] = [];
    for (const d of dataList) {
      const newId = d.id || `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
      const rowData = {
        ...d,
        id: newId,
        createdAt: d.createdAt || new Date().toISOString(),
        updatedAt: d.updatedAt || new Date().toISOString(),
      };
      items.push(rowData);
      inserted.push(rowData);
    }
    this.writeTable(items);
    return { count: inserted.length };
  }

  async update(args: any) {
    const items = this.readTable();
    const index = items.findIndex((item) => matchesWhere(item, args.where));
    if (index === -1) {
      throw new Error(`Record not found for update in model ${this.modelName}`);
    }

    const currentItem = items[index];
    const updatedData = { ...currentItem };

    for (const key of Object.keys(args.data)) {
      const val = args.data[key];
      if (val && typeof val === "object" && ("create" in val || "createMany" in val || "connect" in val)) {
        continue;
      }
      updatedData[key] = val;
    }
    updatedData.updatedAt = new Date().toISOString();

    items[index] = updatedData;
    this.writeTable(items);

    const cloned = { ...updatedData };
    if (args.include) {
      const dbData = readDb();
      const resolver = RELATIONSHIPS[this.modelName];
      if (resolver) {
        resolver(cloned, dbData, args.include);
      }
    }
    return cloned;
  }

  async delete(args: any) {
    const items = this.readTable();
    const index = items.findIndex((item) => matchesWhere(item, args.where));
    if (index === -1) {
      throw new Error(`Record not found for delete in model ${this.modelName}`);
    }
    const removed = items.splice(index, 1)[0];
    this.writeTable(items);
    return removed;
  }

  async deleteMany(args?: any) {
    let items = this.readTable();
    let count = 0;
    if (args?.where) {
      const remaining = items.filter((item) => {
        if (matchesWhere(item, args.where)) {
          count++;
          return false;
        }
        return true;
      });
      this.writeTable(remaining);
    } else {
      count = items.length;
      this.writeTable([]);
    }
    return { count };
  }
}

class MockPrismaClient {
  product = new MockPrismaTable("product");
  productImage = new MockPrismaTable("productImage");
  productVariant = new MockPrismaTable("productVariant");
  variantImage = new MockPrismaTable("variantImage");
  productCategory = new MockPrismaTable("productCategory");
  productCollection = new MockPrismaTable("productCollection");
  watchBrand = new MockPrismaTable("watchBrand");
  watchModel = new MockPrismaTable("watchModel");
  productCompatibility = new MockPrismaTable("productCompatibility");
  user = new MockPrismaTable("user");
  account = new MockPrismaTable("account");
  session = new MockPrismaTable("session");
  address = new MockPrismaTable("address");
  cartItem = new MockPrismaTable("cartItem");
  wishlistItem = new MockPrismaTable("wishlistItem");
  order = new MockPrismaTable("order");
  orderItem = new MockPrismaTable("orderItem");
  orderStatusHistory = new MockPrismaTable("orderStatusHistory");
  payment = new MockPrismaTable("payment");
  coupon = new MockPrismaTable("coupon");
  couponUsage = new MockPrismaTable("couponUsage");
  review = new MockPrismaTable("review");
  reviewImage = new MockPrismaTable("reviewImage");
  customization = new MockPrismaTable("customization");
  newsletterSubscriber = new MockPrismaTable("newsletterSubscriber");
  siteSetting = new MockPrismaTable("siteSetting");
  category = new MockPrismaTable("category");
  collection = new MockPrismaTable("collection");

  async $transaction(callback: (tx: any) => Promise<any>) {
    return callback(this);
  }

  private getMonthlyOrdersList(): { month: string; count: number }[] {
    const data = readDb();
    const orders = data.orders || [];
    const result: { month: string; count: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const count = orders.filter((o: any) => {
        const oDate = new Date(o.createdAt);
        const oMonthKey = `${oDate.getFullYear()}-${String(oDate.getMonth() + 1).padStart(2, "0")}`;
        return oMonthKey === monthKey;
      }).length;
      result.push({ month: monthKey, count });
    }
    return result;
  }

  async $queryRaw(query: any, ...values: any[]) {
    // Handles orders chart queries
    const queryStr = String(query);
    if (queryStr.includes("Order") || queryStr.includes("monthlyOrders")) {
      return this.getMonthlyOrdersList();
    }
    return [];
  }

  async $queryRawUnsafe(query: string, ...values: any[]) {
    if (query.includes("Order")) {
      return this.getMonthlyOrdersList();
    }
    return [];
  }

  async $disconnect() {
    // No-op
  }
}

export const db = new MockPrismaClient() as unknown as PrismaClient;