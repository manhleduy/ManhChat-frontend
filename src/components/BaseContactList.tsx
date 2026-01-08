import React, { useState } from 'react';
import { Search } from 'lucide-react';

import type { GroupDefaultInfo, UserDefaultInfo } from '@/lib/const';
import { useDebounce } from '@/hook/reacthook';


const COLORS = [
  '#22c55e', '#10b981',  // Green
  '#3b82f6', '#0ea5e9',  // Blue
  '#f97316', '#fb923c',  // Orange
  '#a855f7', '#d946ef',  // Purple
  '#ef4444', '#f87171',  // Red
  '#06b6d4', '#22d3ee',  // Cyan
  '#6366f1', '#818cf8',  // Indigo
];
const BaseContactList= (props:any) => {
    const {presentList=[], config, SelectDropBox}= props
    const [query, setQuery] = useState('');
    const queryValue= useDebounce(query, 500);
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const [sortOrder, setSortOrder] = React.useState<'a-z' | 'z-a'>('a-z');
    
    type T= typeof presentList[0]| UserDefaultInfo| GroupDefaultInfo ;

  // group friends by initial
  
  const groupedItems: Record<string, T[]>= React.useMemo(() => {
    return presentList.reduce((acc:any, item:T) => {
      const letter = item.name.slice(0,1).toLocaleUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }, []);
  // compute filtered and optionally sorted groups
  const filteredItems = React.useMemo(() => {
    const res: Record<string, T[]> = {};
    Object.entries(groupedItems).forEach(([letter, list]:[string, T[]]) => {
      let filtered = list.filter((f:any) => f.name.toLowerCase().includes(queryValue.toLowerCase()));
      // TODO: category filtering currently is placeholder; extend when categories exist on Friend
      if (filtered.length > 0) {
        filtered = filtered.sort((a:any, b:any) => {
          const na = a.name.toLowerCase();
          const nb = b.name.toLowerCase();
          if (sortOrder === 'a-z') return na < nb ? -1 : na > nb ? 1 : 0;
          return na > nb ? -1 : na < nb ? 1 : 0;
        });
        res[letter] = filtered;
      }
    });
    return res;
  }, [groupedItems, queryValue, sortOrder]);


  return (
    <main className="flex-1 bg-white h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b-2 border-gray-200 bg-white">
        <h1 className="text-3xl font-semibold text-gray-800 mb-5">{config.page_title}</h1>

        {/* Filter Section */}
        <div className="flex gap-4 items-center flex-wrap">
          <button
            onClick={() => setSortOrder(sortOrder === 'a-z' ? 'z-a' : 'a-z')}
            className="px-3 py-2 border-2 border-green-500 text-green-600 rounded hover:bg-green-500 hover:text-white transition-all font-medium text-sm"
          >
            {sortOrder === 'a-z' ? 'A-Z' : 'Z-A'}
          </button>
          {SelectDropBox?<SelectDropBox selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>:null}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={config.search_placeholder}
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-green-500 rounded text-sm focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {Object.entries(filteredItems).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No friends found</p>
          </div>
        ) : (
          Object.entries(filteredItems).map(([letter, list]) => (
            <div key={letter} className="mb-8">
              <h2 className="text-2xl font-semibold text-green-600 mb-4 pb-2 border-b-2 border-green-50">
                {letter}
              </h2>

              {list.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-lg mb-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold shrink-0"
                    style={{ background: COLORS[item.id % COLORS.length] }}
                  >
                    {item.initial}
                  </div>

                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-800">{item.name}</p>
                    <p className={`text-sm ${item.status === 'Online' ? 'text-green-600' : 'text-gray-500'}`}>
                      {item.status}
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

export default BaseContactList;
