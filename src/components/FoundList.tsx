import React from 'react';


interface UserListProps {
  onSelect: (user: any) => void;
  List: any[];
}

const FoundList: React.FC<UserListProps> = ({ onSelect,List }) => {
  
  return (
    <div className="w-full p-4">
      <h2 className="text-lg font-bold mb-4 text-center">Where do you want to sent this?</h2>
      <div className="grid grid-cols-1 gap-4">
        {List.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => onSelect(item)}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name? item.name: item.groupName}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">{item.phonenumber?"Phone:": "Admin Name:"}</span> {item.phonenumber? item.phonenumber: item.adminName}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">{item.email?"Email":"Detail"}</span> {item.email? item.email: item.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoundList;
