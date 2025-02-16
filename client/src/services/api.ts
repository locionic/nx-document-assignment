const API_BASE_URL = 'http://localhost:4000/api';

export const api = {
  // Folders
  getFolders: () => 
    fetch(`${API_BASE_URL}/folders`).then(res => res.json()),
  
  getDocumentsByFolder: (folderId: string) =>
    fetch(`${API_BASE_URL}/folders/${folderId}`).then(res => res.json()),
    
  createFolder: (name: string) =>
    fetch(`${API_BASE_URL}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    }).then(res => res.json()),
    
  deleteFolder: (id: string) =>
    fetch(`${API_BASE_URL}/folders/${id}`, {
      method: 'DELETE'
    }).then(res => res.json()),

  // Documents
  getDocument: (id: string) =>
    fetch(`${API_BASE_URL}/documents/${id}`).then(res => res.json()),
    
  createDocument: (title: string, content: string, folderId: string) =>
    fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, folderId })
    }).then(res => res.json()),
    
  updateDocument: (id: string, content: string) =>
    fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    }).then(res => res.json()),
    
  deleteDocument: (id: string) =>
    fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'DELETE'
    }).then(res => res.json()),

  // Search
  searchDocuments: (query: string) =>
    fetch(`${API_BASE_URL}/search?query=${query}`).then(res => res.json()),

  // History
  getHistory: () =>
    fetch(`${API_BASE_URL}/history`).then(res => res.json()),
    
  addToHistory: (id: string, title: string) =>
    fetch(`${API_BASE_URL}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title })
    }).then(res => res.json())
}; 