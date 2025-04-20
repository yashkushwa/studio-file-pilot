import { useState, useEffect, useCallback } from 'react';
import { FileItem, SortOption, ViewMode } from '@/types/fileTypes';
import { getFileExtension, sortFiles } from '@/utils/fileUtils';
import { toast } from 'sonner';

// Base path for our file manager
const BASE_PATH = '/app/luna';

// Initialize with a real "luna" folder
const initializeFileSystem = () => {
  // Create the luna folder if it doesn't exist
  const fileSystem = JSON.parse(localStorage.getItem('fileSystem') || '{}');
  
  if (!fileSystem[BASE_PATH]) {
    // Initialize the luna folder
    fileSystem[BASE_PATH] = [];
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
    
    // Show success message
    toast.success('Luna folder created successfully');
  }
  
  return fileSystem[BASE_PATH];
};

// Get files from our simulated file system
const getFilesFromPath = (path: string): FileItem[] => {
  try {
    const fileSystem = JSON.parse(localStorage.getItem('fileSystem') || '{}');
    return fileSystem[path] || [];
  } catch (err) {
    console.error('Error loading files:', err);
    return [];
  }
};

// Save files to our simulated file system
const saveFilesToPath = (path: string, files: FileItem[]) => {
  try {
    const fileSystem = JSON.parse(localStorage.getItem('fileSystem') || '{}');
    fileSystem[path] = files;
    localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
  } catch (err) {
    console.error('Error saving files:', err);
  }
};

export const useFileManager = (initialPath = BASE_PATH) => {
  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Initialize file system and fetch initial files
  useEffect(() => {
    try {
      initializeFileSystem();
      fetchFiles(initialPath);
    } catch (err) {
      console.error('Error initializing file system:', err);
      setError('Failed to initialize file system');
      toast.error('Failed to initialize file system');
    }
  }, [initialPath]);

  // Function to fetch files from the given path
  const fetchFiles = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get files from our simulated file system
      const filesFromPath = getFilesFromPath(path);
      
      // Process files to ensure they have all required properties
      const processedFiles = filesFromPath.map(file => ({
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

  // Function to upload files
  const uploadFiles = useCallback(async (fileList: FileList) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert FileList to an array of files
      const newFiles: FileItem[] = Array.from(fileList).map(file => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: 'file',
        size: file.size,
        modified: new Date().toISOString(),
        path: `${currentPath}/${file.name}`,
        extension: getFileExtension(file.name)
      }));
      
      // Get current files and add new ones
      const currentFiles = getFilesFromPath(currentPath);
      const updatedFiles = [...currentFiles, ...newFiles];
      
      // Save to our simulated file system
      saveFilesToPath(currentPath, updatedFiles);
      
      // Refresh the file list
      toast.success('Files uploaded successfully');
      fetchFiles(currentPath);
    } catch (err) {
      console.error('Failed to upload files:', err);
      setError('Failed to upload files. Please try again.');
      toast.error('Failed to upload files');
    } finally {
      setLoading(false);
    }
  }, [currentPath, fetchFiles]);

  // Function for file/folder deletion
  const deleteItems = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get current files
      const currentFiles = getFilesFromPath(currentPath);
      
      // Filter out selected files
      const remainingFiles = currentFiles.filter(file => !selectedFiles.includes(file.id));
      
      // Save updated file list
      saveFilesToPath(currentPath, remainingFiles);
      
      // Clear selection and refresh files
      setSelectedFiles([]);
      toast.success(`${selectedFiles.length} item(s) deleted`);
      fetchFiles(currentPath);
    } catch (err) {
      console.error('Failed to delete items:', err);
      setError('Failed to delete selected items. Please try again.');
      toast.error('Failed to delete items');
    } finally {
      setLoading(false);
    }
  }, [selectedFiles, currentPath, fetchFiles]);

  // Function to create a new folder
  const createFolder = useCallback(async (folderName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create new folder object
      const newFolder: FileItem = {
        id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: folderName,
        type: 'folder',
        modified: new Date().toISOString(),
        path: `${currentPath}/${folderName}`,
      };
      
      // Get current files and add new folder
      const currentFiles = getFilesFromPath(currentPath);
      
      // Check if folder with same name exists
      if (currentFiles.some(file => file.name === folderName && file.type === 'folder')) {
        setError('A folder with this name already exists.');
        toast.error('A folder with this name already exists');
        return;
      }
      
      const updatedFiles = [...currentFiles, newFolder];
      
      // Save to our simulated file system
      saveFilesToPath(currentPath, updatedFiles);
      
      // Also create an empty array for the new folder's path
      saveFilesToPath(newFolder.path, []);
      
      // Refresh the file list
      toast.success(`Folder "${folderName}" created successfully`);
      fetchFiles(currentPath);
    } catch (err) {
      console.error('Failed to create folder:', err);
      setError('Failed to create folder. Please try again.');
      toast.error('Failed to create folder');
    } finally {
      setLoading(false);
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
