
import Link from 'next/link';
import { fetchUsers } from '../services/userService';




export default async function UsersPage() {
    const users = await fetchUsers();
    console.log("users in page are: ", users);
  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user._id}>
              <p>{user.name}</p>
            <Link href={`/users/${user._id}`}>Profile</Link>
            </li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  );
}

// Fetch data on the server side