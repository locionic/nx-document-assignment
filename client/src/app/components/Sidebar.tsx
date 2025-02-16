import { useEffect, useState } from 'react';
import { Document, Folder } from '../../types';
import { api } from '../../services/api';
import { FolderIcon, FileTextIcon, PlusIcon } from 'lucide-react';

interface SidebarProps {
  selectedFolder: Folder | null;
  onFolderSelect: (folder: Folder) => void;
  onDocumentSelect: (document: Document) => void;
  onCreateDocument: () => void;
}

export default function Sidebar({
  selectedFolder,
  onFolderSelect,
  onDocumentSelect,
  onCreateDocument,
}: SidebarProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    api.getFolders().then(setFolders);
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      api.getDocumentsByFolder(selectedFolder.id).then(setDocuments);
    }
  }, [selectedFolder]);

  return (
    <div className="w-64 h-screen bg-secondary border-r border-border p-4">
      <div className="space-y-4">
        <div className="font-medium text-sm text-secondary-foreground">Folders</div>
        <div className="space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => onFolderSelect(folder)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                selectedFolder?.id === folder.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary/80'
              }`}
            >
              <FolderIcon className="h-4 w-4" />
              {folder.name}
            </button>
          ))}
        </div>

        {selectedFolder && (
          <>
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm text-secondary-foreground">Documents</div>
              <button
                onClick={onCreateDocument}
                className="p-1 hover:bg-secondary/80 rounded-md"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              {documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onDocumentSelect(doc)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-secondary/80"
                >
                  <FileTextIcon className="h-4 w-4" />
                  {doc.title}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 