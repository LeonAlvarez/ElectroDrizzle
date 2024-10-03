import { eq, SQL } from "drizzle-orm";
import { users } from "../schema";
import { User, UserInsert } from "../schema/users";

export interface UserService {
  getUsers: (where?: SQL) => SQL<User[]>;
  getUserById: (id: string) => SQL<User[]>;
  createUser: (userData: UserInsert) => SQL<User[]>;
  updateUser: (id: string, userData: Partial<UserInsert>) => SQL<User[]>;
  deleteUser: (id: string) => SQL<User[]>;
}

export function createUserService(db: any): UserService {
  return {
    getUsers: (where?: SQL) => {
      return db.select().from(users).where(where);
    },
    getUserById: (id: string) => {
      return db.select().from(users).where(eq(users.id, parseInt(id))).limit(1);
    },
    createUser: (userData: UserInsert) => {
      if (typeof userData.name !== 'string') {
        throw new Error('Name is required and must be a string');
      }
      return db.insert(users).values(userData as typeof users.$inferInsert).returning();
    },

    updateUser: (id: string, userData: Partial<UserInsert>) => {
      return db.update(users).set(userData).where(eq(users.id, parseInt(id))).returning();
    },

    deleteUser: (id: string) => {
      return db.delete(users).where(eq(users.id, parseInt(id))).returning();
    }
  };
}