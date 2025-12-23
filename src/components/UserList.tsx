import type { UserDefaultInfo } from '@/lib/const';
import React from 'react';

// Define the User interface


// Sample user list


interface UserListProps {
  onUserSelect: (user: any) => void;
  userList: UserDefaultInfo[];
}

const UserList: React.FC<UserListProps> = ({ onUserSelect,userList }) => {
  return (
    <div className="w-full p-4">
      <h2 className="text-lg font-bold mb-4 text-center">User List</h2>
      <div className="grid grid-cols-1 gap-4">
        {userList.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => onUserSelect(user)}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{user.name}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Phone:</span> {user.phonenumber}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span> {user.email}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
