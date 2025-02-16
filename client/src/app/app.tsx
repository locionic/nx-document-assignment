// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DocumentView from './components/DocumentView';
import HistoryPanel from './components/HistoryPanel';
import { Document, Folder } from '../types';
import { api } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Plus } from 'lucide-react';

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
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Document Management System</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-9"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 border-r">
          <Sidebar
            selectedFolder={selectedFolder}
            onFolderSelect={setSelectedFolder}
            onDocumentSelect={(doc) => {
              setSelectedDocument(doc);
              api.addToHistory(doc.id, doc.title);
            }}
            onCreateDocument={() => setIsCreatingDocument(true)}
          />
        </div>

        {/* Main Document Area */}
        <div className="flex-1">
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">
              {selectedFolder ? selectedFolder.name : 'All Documents'}
            </h2>
            <DocumentView
              document={selectedDocument}
              isCreating={isCreatingDocument}
              folderId={selectedFolder?.id}
              onDocumentCreated={(doc) => {
                setSelectedDocument(doc);
                setIsCreatingDocument(false);
              }}
              onDocumentUpdated={setSelectedDocument}
              onDocumentDeleted={() => {
                setSelectedDocument(null);
              }}
              onCancel={() => {
                setIsCreatingDocument(false);
                setSelectedDocument(null);
              }}
            />
          </div>
        </div>

        {/* Right Sidebar - Recent Documents */}
        <div className="w-80 border-l">
          <div className="p-4">
            <h2 className="font-medium mb-4">Recent Documents</h2>
            <HistoryPanel onDocumentSelect={handleDocumentSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
