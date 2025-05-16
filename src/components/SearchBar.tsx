// components/SearchBar.tsx
import React, {useState, useCallback} from 'react';
import {Input} from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({onSearch}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchQuery(query);
      onSearch(query);
    },
    [onSearch]
  );

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Search products..."
        className="w-full rounded-md"
        value={searchQuery}
        onChange={handleInputChange}
      />
    </div>
  );
};
