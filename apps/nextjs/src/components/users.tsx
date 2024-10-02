'use client'
//import { useLiveQuery } from '@electric-sql/pglite-react'

export const Users = () => {
  const users = [];
  // const maxNumber = 100
  // const users = useLiveQuery(`
  //   SELECT *
  //   FROM users
  //   ORDER BY id
  //   LIMIT $1;
  // `, [maxNumber]) || [];

  return (
    <>
      {users?.map((user: any) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </>
  )
}

export default Users;