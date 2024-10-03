"use client";

import { createUserService } from "db/services/users";
import { useDbLiveQuery } from "@/hooks/useDbLiveQuery";
import { User } from "db/schema/users";
import { useLiveQuery } from "@electric-sql/pglite-react";

export const Users = () => {
  const users = useDbLiveQuery<User[], { limit: number }>({
    queryFn: (db, extra) => {
      const { getUsers } = createUserService(db);
      return getUsers().limit(extra.limit);
    },
    data: { limit: 10 },
  });

  const data = useLiveQuery(`select * from users limit $1`, [10]);
  const users2 = data?.rows || [];

  return (
    <>
      <div className="flex flex-col gap-2 mb-6">
        {users?.map((user: any) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
      <div className="flex flex-col gap-2 mb-6">
        {users2?.map((user: any) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    </>
  );
};

export default Users;
