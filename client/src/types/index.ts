export interface Document {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  type: 'folder';
}

export interface HistoryEntry {
  id: string;
  title: string;
  timestamp: number;
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
} 