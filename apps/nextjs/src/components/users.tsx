"use client";

import { createUserService } from "db/services/users";
import { useDbLiveQuery } from "@/hooks/useDbLiveQuery";
import { User } from "db/schema/users";

export const Users = () => {
  const users = useDbLiveQuery<User[], { limit: number }>({
    queryFn: (db, extra) => {
      const { getUsers } = createUserService(db);
      return getUsers().limit(extra.limit);
    },
    data: { limit: 10 },
  });

  console.log("users", users);

  return (
    <>
      {users?.map((user: any) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </>
  );
};

export default Users;
