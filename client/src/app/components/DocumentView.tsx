import { useState, useEffect } from 'react';
import { Document } from '../../types';
import { api } from '../../services/api';
import { Save, X, Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
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
import MarkdownPreview from './MarkdownPreview';

interface DocumentViewProps {
  document: Document | null;
  isCreating: boolean;
  folderId?: string;
  onDocumentCreated: (doc: Document) => void;
  onDocumentUpdated: (doc: Document) => void;
  onDocumentDeleted: () => void;
  onCancel: () => void;
}

export default function DocumentView({
  document,
  isCreating,
  folderId,
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
  onCancel,
}: DocumentViewProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (document) {
      setContent(document.content);
    } else {
      setContent('');
      setTitle('');
    }
  }, [document]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (isCreating && folderId) {
        const newDoc = await api.createDocument(title, content, folderId);
        onDocumentCreated(newDoc);
      } else if (document) {
        const updatedDoc = await api.updateDocument(document.id, content);
        onDocumentUpdated(updatedDoc);
      }
    } catch (error) {
      console.error('Failed to save document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (document) {
      await api.deleteDocument(document.id);
      onDocumentDeleted();
      setShowDeleteDialog(false);
    }
  };

  if (!isCreating && !document) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p>Select a document or create a new one</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your documents will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 max-w-xl">
          {isCreating ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
              className="text-lg font-medium"
            />
          ) : (
            <h1 className="text-xl font-semibold truncate">{document?.title}</h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isCreating && document && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? (
              <>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" /> Preview
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-md border">
        {isPreview ? (
          <div className="h-full overflow-auto bg-background p-4">
            <MarkdownPreview content={content} />
          </div>
        ) : (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your document content here..."
            className="h-full resize-none font-mono border-0 focus-visible:ring-0"
          />
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          <X className="h-4 w-4 mr-2" /> Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{document?.title}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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