"use client";

import { createUserService } from "db/services/users";
import { useDbLiveQuery } from "@/hooks/useDbLiveQuery";
import { User } from "db/schema/users";
import { useLiveQuery } from "@electric-sql/pglite-react";
import { faker } from '@faker-js/faker';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const Users = () => {
  const users = useDbLiveQuery<User[], { limit: number }>({
    queryFn: (db, extra) => {
      const { getUsers } = createUserService(db);
      return getUsers().limit(extra.limit);
    },
    data: { limit: 10 },
  });

  const data = useLiveQuery<User>(`select * from users limit $1`, [10]);
  const users2 = data?.rows || [];

  const createUser = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: faker.person.fullName() }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const user = await response.json();
      console.log('User created:', user);
      // Optionally, you can update the local state or trigger a refetch of the users list here
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center my-6 w-full">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={createUser}>Create User
        </button>
      </div>
      <div className="flex flex-row items-center justify-around mb-6 w-full">
        <div className="flex flex-col gap-2 mb-6">
          {users?.map((user) => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
        <div className="flex flex-col gap-2 mb-6">
          {users2?.map((user) => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Users;
