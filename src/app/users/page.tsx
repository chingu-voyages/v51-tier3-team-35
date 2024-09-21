
import { fetchUsers } from '../services/userService';

interface User {
  _id: string;
  name: string;
}


export default async function UsersPage() {
    const users = await fetchUsers();
  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.length > 0 ? (
          users.map((user: User) => (
            <li key={user._id}>{user.name}</li>
          ))
        ) : (
          <p>No users found</p>
        )}
      </ul>
    </div>
  );
}

// Fetch data on the server side