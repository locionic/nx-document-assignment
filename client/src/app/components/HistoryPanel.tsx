import { useEffect, useState } from 'react';
import { File, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/ui/button';
import type { HistoryEntry } from '../../types';

interface HistoryPanelProps {
  onDocumentSelect: (id: string) => void;
}

export default function HistoryPanel({ onDocumentSelect }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const recentDocs = await api.getHistory();
    
    // Remove duplicates by keeping only the most recent entry for each document
    const uniqueDocs = recentDocs.reduce((acc, current) => {
      const existingDoc = acc.find(doc => doc.id === current.id);
      if (!existingDoc || new Date(current.timestamp) > new Date(existingDoc.timestamp)) {
        // Remove any existing entry for this document
        const filtered = acc.filter(doc => doc.id !== current.id);
        return [...filtered, current];
      }
      return acc;
    }, [] as HistoryEntry[]);

    // Sort by timestamp, most recent first
    const sortedDocs = uniqueDocs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Limit to 10 most recent documents
    setHistory(sortedDocs.slice(0, 10));
  };

  if (history.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm">
        <Clock className="h-4 w-4 mx-auto mb-2" />
        No recent documents
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {history.map((entry) => (
        <Button
          key={entry.id}
          variant="ghost"
          className="w-full justify-start"
          onClick={() => onDocumentSelect(entry.id)}
        >
          <File className="h-4 w-4 mr-2 flex-shrink-0" />
          <div className="flex flex-col items-start truncate">
            <span className="truncate w-full">{entry.title}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(entry.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </Button>
      ))}
    </div>
  );
} 