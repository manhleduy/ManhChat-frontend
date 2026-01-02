import React from 'react';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { GroupDefaultInfo } from '@/lib/const';
import { selectGroupList } from '@/redux/slice/GroupListSlice';
import { useSelector } from 'react-redux';


const COLORS = [
  '#ff6b9d', '#4a90e2', '#f39c12', '#9b59b6', '#e74c3c', '#1abc9c', '#34495e', '#e67e22', '#2ecc71', '#8e44ad',
];


const defaultConfig = {
  page_title: 'Groups',
  search_placeholder: 'Search groups...',
};

const GroupList = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [sortOrder, setSortOrder] = React.useState<'a-z' | 'z-a'>('a-z');
 const groupsData: GroupDefaultInfo[] = useSelector(selectGroupList).groupList;

  // group by initial
  const groupedGroups = React.useMemo(() => {
    return groupsData.reduce((acc, group) => {
      const letter = group.groupName.slice(0, 1).toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(group);
      return acc;
    }, {} as Record<string, GroupDefaultInfo[]>);
  }, []);

  // compute filtered and sorted groups
  const filteredGroups = React.useMemo(() => {
    const res: Record<string, GroupDefaultInfo[]> = {};
    Object.entries(groupedGroups).forEach(([letter, list]) => {
      let filtered = list.filter(g => g.groupName.toLowerCase().includes(searchQuery.toLowerCase()));
      if (filtered.length > 0) {
        filtered = filtered.sort((a, b) => {
          const na = a.groupName.toLowerCase();
          const nb = b.groupName.toLowerCase();
          if (sortOrder === 'a-z') return na < nb ? -1 : na > nb ? 1 : 0;
          return na > nb ? -1 : na < nb ? 1 : 0;
        });
        res[letter] = filtered;
      }
    });
    return res;
  }, [groupedGroups, searchQuery, sortOrder]);

  return (
    <main data-theme="dark" className="flex-1 h-full bg-white flex flex-col overflow-hidden">
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
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
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

      {/* Groups List */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {Object.entries(filteredGroups).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No groups found</p>
          </div>
        ) : (
          Object.entries(filteredGroups).map(([letter, groups]) => (
            <div key={letter} className="mb-8">
              <h2 className="text-2xl font-semibold text-green-600 mb-4 pb-2 border-b-2 border-green-50">
                {letter}
              </h2>

              {groups.map(group => (
                <div
                  key={group.id}
                  className="flex items-center gap-4 p-4 rounded-lg mb-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold shrink-0"
                    style={{ background: COLORS[Math.floor(Math.random() * COLORS.length)]  }}
                  >
                    {group.groupName.slice(0,1).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-800">{group.groupName}</p>
                    <p className={`text-sm ${!group.isRestricted ? 'text-green-600' : 'text-gray-500'}`}>
                       • {group.isRestricted ? 'Restricted' : 'Public'}
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

export default GroupList;