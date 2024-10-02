'use client'

import { useLiveQuery } from '@electric-sql/pglite-react'

export const Users = () => {

  const maxNumber = 100
  const data = useLiveQuery(`
    SELECT *
    FROM users
    ORDER BY id
    LIMIT $1;
  `, [maxNumber]);

  console.log("data", data);
  const users = data?.rows || []
  console.log("users", users);

  return (
    <>
      {users?.map((user: any) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </>
  )
}

export default Users;