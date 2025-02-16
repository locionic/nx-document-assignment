import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { api } from '../../services/api';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import type { SearchResult } from '../../types';

interface SearchBarProps {
  onDocumentSelect: (id: string) => void;
}

export default function SearchBar({ onDocumentSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (query.length > 2) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        const searchResults = await api.searchDocuments(query);
        setResults(searchResults);
        setIsOpen(true);
      }, 300);
    } else {
      setResults([]);
      setIsOpen(false);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents..."
          className="pl-9"
        />
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-popover text-popover-foreground border rounded-md shadow-md z-10">
          {results.map((result) => (
            <Button
              key={result.id}
              variant="ghost"
              className="w-full justify-start px-3 py-2 h-auto"
              onClick={() => {
                onDocumentSelect(result.id);
                setIsOpen(false);
                setQuery('');
              }}
            >
              <div>
                <div className="font-medium">{result.title}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {result.snippet}
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
