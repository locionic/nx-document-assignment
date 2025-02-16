import { useEffect, useState } from 'react';
import { Folder, File, Plus } from 'lucide-react';
import { Document, Folder as FolderType } from '../../types';
import { api } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

interface SidebarProps {
  selectedFolder: FolderType | null;
  onFolderSelect: (folder: FolderType | null) => void;
  onDocumentSelect: (document: Document) => void;
  onCreateDocument: () => void;
}

export default function Sidebar({
  selectedFolder,
  onFolderSelect,
  onDocumentSelect,
  onCreateDocument,
}: SidebarProps) {
  const [folders, setFolders] = useState<FolderType[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<FolderType | null>(null);

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      api.getDocumentsByFolder(selectedFolder.id).then(setDocuments);
    } else {
      setDocuments([]);
    }
  }, [selectedFolder]);

  const loadFolders = async () => {
    const fetchedFolders = await api.getFolders();
    setFolders(fetchedFolders);
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      await api.createFolder(newFolderName);
      setNewFolderName('');
      setIsDialogOpen(false);
      loadFolders();
    }
  };

  const handleDeleteFolder = async () => {
    if (folderToDelete) {
      await api.deleteFolder(folderToDelete.id);
      if (selectedFolder?.id === folderToDelete.id) {
        onFolderSelect(null);
      }
      setFolderToDelete(null);
      loadFolders();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <h2 className="font-medium">Folders</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto px-2 space-y-1">
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant={selectedFolder?.id === folder.id ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onFolderSelect(folder)}
          >
            <Folder className="h-4 w-4 mr-2" />
            {folder.name}
          </Button>
        ))}
      </div>

      {selectedFolder && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Documents</h3>
            <Button variant="ghost" size="icon" onClick={onCreateDocument}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {documents.map((doc) => (
              <Button
                key={doc.id}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => onDocumentSelect(doc)}
              >
                <File className="h-4 w-4 mr-2" />
                {doc.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
              }}
            />
            <Button onClick={handleCreateFolder}>Create</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!folderToDelete}
        onOpenChange={(open) => !open && setFolderToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{folderToDelete?.name}"? This will also delete all documents within this folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFolder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 