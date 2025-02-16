import { useState, useEffect } from 'react';
import { Document } from '../../types';
import { api } from '../../services/api';
import { SaveIcon, XIcon, EyeIcon, PencilIcon } from 'lucide-react';
import MarkdownPreview from './MarkdownPreview';

interface DocumentViewProps {
  document: Document | null;
  isCreating: boolean;
  folderId?: string;
  onDocumentCreated: (doc: Document) => void;
  onDocumentUpdated: (doc: Document) => void;
  onCancel: () => void;
}

export default function DocumentView({
  document,
  isCreating,
  folderId,
  onDocumentCreated,
  onDocumentUpdated,
  onCancel,
}: DocumentViewProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      // You could add a toast notification here
    } finally {
      setIsSaving(false);
    }
  };

  if (!isCreating && !document) {
    return (
      <div className="flex h-full items-center justify-center text-secondary-foreground">
        Select a document or create a new one
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      <div className="flex items-center justify-between">
        {isCreating ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
            className="flex-1 px-3 py-2 rounded-md border bg-background"
          />
        ) : (
          <h1 className="text-xl font-semibold">{document?.title}</h1>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary"
          >
            {isPreview ? (
              <>
                <PencilIcon className="h-4 w-4" /> Edit
              </>
            ) : (
              <>
                <EyeIcon className="h-4 w-4" /> Preview
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <MarkdownPreview content={content} />
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your document content here..."
            className="w-full h-full p-3 rounded-md border bg-background resize-none font-mono text-sm"
          />
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary"
          disabled={isSaving}
        >
          <XIcon className="h-4 w-4" /> Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <SaveIcon className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
} 