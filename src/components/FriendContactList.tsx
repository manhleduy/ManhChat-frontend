import React, { use } from 'react';
import { Search } from 'lucide-react';
import { selectUserInfo } from '@/redux/slice/userSlice';
import { useAppSelector } from '@/redux/reduxHook';
import { selectFriendList } from '@/redux/slice/FriendListSlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const COLORS = [
  '#22c55e', '#10b981',  // Green
  '#3b82f6', '#0ea5e9',  // Blue
  '#f97316', '#fb923c',  // Orange
  '#a855f7', '#d946ef',  // Purple
  '#ef4444', '#f87171',  // Red
  '#06b6d4', '#22d3ee',  // Cyan
  '#6366f1', '#818cf8',  // Indigo
];

type Friend = {
  id: number;
  name: string;
  initial: string;
  status: 'Online' | 'Offline';
  color: string;
};


const defaultConfig = {
  page_title: 'Friend List',
  search_placeholder: 'Search friends...',
};


const FriendContactList= () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [sortOrder, setSortOrder] = React.useState<'a-z' | 'z-a'>('a-z');
  const friendList  = useAppSelector(selectFriendList).friendList;
  const currentUser= useAppSelector(selectUserInfo).info;
  
  const friends: Friend[] = friendList.map(friend => ({
    id: friend.id,
    name: friend.name,
    initial: friend.name.charAt(0).toUpperCase(),
    status: 'Online',
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
  

  
  // group friends by initial
  const groupedFriends = React.useMemo(() => {
    return friends.reduce((acc, friend) => {
      const letter = friend.initial;
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(friend);
      return acc;
    }, {} as Record<string, Friend[]>);
  }, [friends]);

  // compute filtered and optionally sorted groups
  const filteredFriends = React.useMemo(() => {
    const res: Record<string, Friend[]> = {};
    Object.entries(groupedFriends).forEach(([letter, list]) => {
      let filtered = list.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
      // TODO: category filtering currently is placeholder; extend when categories exist on Friend
      if (filtered.length > 0) {
        filtered = filtered.sort((a, b) => {
          const na = a.name.toLowerCase();
          const nb = b.name.toLowerCase();
          if (sortOrder === 'a-z') return na < nb ? -1 : na > nb ? 1 : 0;
          return na > nb ? -1 : na < nb ? 1 : 0;
        });
        res[letter] = filtered;
      }
    });
    return res;
  }, [groupedFriends, searchQuery, sortOrder]);

  return (
    <main className="flex-1 bg-white h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b-2 border-gray-200 bg-white">
        <h1 className="text-3xl font-semibold text-gray-800 mb-5">{defaultConfig.page_title}</h1>

        {/* Filter Section */}
        <div className="flex gap-4 items-center flex-wrap">
          <button
            onClick={() => setSortOrder(sortOrder === 'a-z' ? 'z-a' : 'a-z')}
            className="px-3 py-2 border-2 border-green-500 text-green-600 rounded hover:bg-green-500 hover:text-white transition-all font-medium text-sm"
          >
            {sortOrder === 'a-z' ? 'A-Z' : 'Z-A'}
          </button>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40 border-2 border-green-500 text-gray-800 text-sm font-medium hover:border-green-600">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Customer">Customer</SelectItem>
              <SelectItem value="Family">Family</SelectItem>
              <SelectItem value="Job">Job</SelectItem>
              <SelectItem value="Friend">Friend</SelectItem>
              <SelectItem value="Pioneer">Pioneer</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={defaultConfig.search_placeholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-green-500 rounded text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {Object.entries(filteredFriends).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No friends found</p>
          </div>
        ) : (
          Object.entries(filteredFriends).map(([letter, friends]) => (
            <div key={letter} className="mb-8">
              <h2 className="text-2xl font-semibold text-green-600 mb-4 pb-2 border-b-2 border-green-50">
                {letter}
              </h2>

              {friends.map(friend => (
                <div
                  key={friend.id}
                  className="flex items-center gap-4 p-4 rounded-lg mb-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold shrink-0"
                    style={{ background: friend.color }}
                  >
                    {friend.initial}
                  </div>

                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-800">{friend.name}</p>
                    <p className={`text-sm ${friend.status === 'Online' ? 'text-green-600' : 'text-gray-500'}`}>
                      {friend.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default FriendContactList;
