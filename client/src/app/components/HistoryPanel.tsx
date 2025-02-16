import { useEffect, useState } from 'react';
import { ClockIcon } from 'lucide-react';
import { api } from '../../services/api';
import type { HistoryEntry } from '../../types';

interface HistoryPanelProps {
  onDocumentSelect: (id: string) => void;
}

export default function HistoryPanel({ onDocumentSelect }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    api.getHistory().then(setHistory);
  }, []);

  if (history.length === 0) return null;

  return (
    <div className="border-t border-border mt-4 pt-4">
      <div className="font-medium text-sm text-secondary-foreground mb-2">Recently Viewed</div>
      <div className="space-y-1">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onDocumentSelect(entry.id)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-secondary/80"
          >
            <ClockIcon className="h-4 w-4" />
            <div className="flex-1 text-left">
              <div className="truncate">{entry.title}</div>
              <div className="text-xs text-secondary-foreground/70">
                {new Date(entry.timestamp).toLocaleDateString()}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 