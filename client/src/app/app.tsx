// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DocumentView from './components/DocumentView';
import SearchBar from './components/SearchBar';
import HistoryPanel from './components/HistoryPanel';
import { Document, Folder } from '../types';
import { api } from '../services/api';
import './app.module.css';

export function App() {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);

  const handleDocumentSelect = async (id: string) => {
    const doc = await api.getDocument(id);
    if (doc) {
      setSelectedDocument(doc);
      api.addToHistory(doc.id, doc.title);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-4">
          <SearchBar onDocumentSelect={handleDocumentSelect} />
        </div>
        <Sidebar
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          onDocumentSelect={(doc) => {
            setSelectedDocument(doc);
            api.addToHistory(doc.id, doc.title);
          }}
          onCreateDocument={() => setIsCreatingDocument(true)}
        />
        <div className="px-4 pb-4">
          <HistoryPanel onDocumentSelect={handleDocumentSelect} />
        </div>
      </div>
      <main className="flex-1 overflow-hidden">
        <DocumentView
          document={selectedDocument}
          isCreating={isCreatingDocument}
          folderId={selectedFolder?.id}
          onDocumentCreated={(doc) => {
            setSelectedDocument(doc);
            setIsCreatingDocument(false);
          }}
          onDocumentUpdated={setSelectedDocument}
          onCancel={() => {
            setIsCreatingDocument(false);
            setSelectedDocument(null);
          }}
        />
      </main>
    </div>
  );
}

export default App;
