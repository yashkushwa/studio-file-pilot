import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FileItem, SortOption, ViewMode } from '@/types/fileTypes';
import { getFileExtension, sortFiles } from '@/utils/fileUtils';

// Mock data for frontend development - will be replaced with actual API calls
const MOCK_BASE_PATH = '/app/luna';

const generateMockFiles = (path: string): FileItem[] => {
  // Extract the last part of the path for folder name
  const parts = path.split('/').filter(Boolean);
  const currentFolder = parts.length ? parts[parts.length - 1] : 'this_studio';
  
  const mockFiles: FileItem[] = [];
  
  // Add some folders
  const folderCount = Math.floor(Math.random() * 5) + 2; // 2-6 folders
  for (let i = 0; i < folderCount; i++) {
    mockFiles.push({
      id: `folder-${i}-${Date.now()}`,
      name: `Folder ${i + 1}`,
      type: 'folder',
      modified: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      path: `${path}/${currentFolder}_${i + 1}`,
    });
  }
  
  // Add some files with different extensions
  const extensions = ['pdf', 'docx', 'jpg', 'png', 'txt', 'mp4', 'zip'];
  const fileCount = Math.floor(Math.random() * 10) + 5; // 5-14 files
  
  for (let i = 0; i < fileCount; i++) {
    const extension = extensions[Math.floor(Math.random() * extensions.length)];
    const size = Math.floor(Math.random() * 10000000); // Random size up to ~10MB
    
    mockFiles.push({
      id: `file-${i}-${Date.now()}`,
      name: `File ${i + 1}.${extension}`,
      type: 'file',
      size: size,
      modified: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      path: `${path}/File ${i + 1}.${extension}`,
      extension: extension,
    });
  }
  
  return mockFiles;
};

export const useFileManager = (initialPath = MOCK_BASE_PATH) => {
  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Function to fetch files from the given path
  const fetchFiles = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call
      // const response = await axios.get(`/api/files?path=${encodeURIComponent(path)}`);
      // const data = response.data;
      
      // For now, we'll use mock data
      const mockData = generateMockFiles(path);
      const processedFiles = mockData.map(file => ({
        ...file,
        extension: file.type === 'file' ? getFileExtension(file.name) : undefined
      }));
      
      setFiles(sortFiles(processedFiles, sortBy, sortAscending));
      setCurrentPath(path);
    } catch (err) {
      console.error('Failed to fetch files:', err);
      setError('Failed to load files. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortAscending]);
  
  // Initial fetch
  useEffect(() => {
    fetchFiles(initialPath);
  }, [initialPath, fetchFiles]);
  
  // Handle changing directories
  const navigateToFolder = useCallback((path: string) => {
    setSelectedFiles([]);
    fetchFiles(path);
  }, [fetchFiles]);
  
  // Handle file selection
  const toggleFileSelection = useCallback((fileId: string) => {
    setSelectedFiles(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      } else {
        return [...prev, fileId];
      }
    });
  }, []);
  
  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedFiles([]);
  }, []);
  
  // Handle sorting
  const handleSort = useCallback((sortOption: SortOption) => {
    if (sortOption === sortBy) {
      // Toggle direction if same field
      setSortAscending(prev => !prev);
    } else {
      // New sort field, default to ascending
      setSortBy(sortOption);
      setSortAscending(true);
    }
    
    // Re-sort files
    setFiles(prevFiles => sortFiles(prevFiles, sortOption, 
      sortOption === sortBy ? !sortAscending : true));
  }, [sortBy, sortAscending]);
  
  // Toggle view mode
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'list' ? 'grid' : 'list');
  }, []);
  
  // Function to simulate file upload
  const uploadFiles = useCallback(async (files: FileList) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would upload files to the server
      // const formData = new FormData();
      // Array.from(files).forEach(file => formData.append('files', file));
      // await axios.post(`/api/upload?path=${encodeURIComponent(currentPath)}`, formData);
      
      // For now, we'll simulate a delay and then refresh the file list
      await new Promise(resolve => setTimeout(resolve, 1000));
      fetchFiles(currentPath);
    } catch (err) {
      console.error('Failed to upload files:', err);
      setError('Failed to upload files. Please try again.');
    }
  }, [currentPath, fetchFiles]);
  
  // Function to simulate file/folder deletion
  const deleteItems = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would delete items on the server
      // await axios.delete('/api/files', { data: { ids: selectedFiles } });
      
      // For now, we'll simulate a delay and then refresh the file list
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSelectedFiles([]);
      fetchFiles(currentPath);
    } catch (err) {
      console.error('Failed to delete items:', err);
      setError('Failed to delete selected items. Please try again.');
    }
  }, [selectedFiles, currentPath, fetchFiles]);
  
  // Function to simulate creating a new folder
  const createFolder = useCallback(async (folderName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would create a folder on the server
      // await axios.post('/api/folders', { path: currentPath, name: folderName });
      
      // For now, we'll simulate a delay and then refresh the file list
      await new Promise(resolve => setTimeout(resolve, 1000));
      fetchFiles(currentPath);
    } catch (err) {
      console.error('Failed to create folder:', err);
      setError('Failed to create folder. Please try again.');
    }
  }, [currentPath, fetchFiles]);

  return {
    files,
    currentPath,
    selectedFiles,
    loading,
    error,
    sortBy,
    sortAscending,
    viewMode,
    navigateToFolder,
    toggleFileSelection,
    clearSelection,
    handleSort,
    toggleViewMode,
    uploadFiles,
    deleteItems,
    createFolder
  };
};
