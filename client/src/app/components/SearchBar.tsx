import { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { api } from '../../services/api';
import type { SearchResult } from '../../types';

interface SearchBarProps {
  onDocumentSelect: (id: string) => void;
}

export default function SearchBar({ onDocumentSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length > 2) {
      const searchResults = await api.searchDocuments(value);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-foreground/50" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search documents..."
          className="w-full pl-9 pr-4 py-2 rounded-md border bg-background"
        />
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-background border rounded-md shadow-lg py-1 z-10">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => {
                onDocumentSelect(result.id);
                setIsOpen(false);
                setQuery('');
              }}
              className="w-full px-3 py-2 text-left hover:bg-secondary"
            >
              <div className="font-medium text-sm">{result.title}</div>
              <div className="text-xs text-secondary-foreground/70 truncate">
                {result.snippet}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
