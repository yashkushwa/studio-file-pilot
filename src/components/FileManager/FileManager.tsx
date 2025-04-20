
import { useState } from 'react';
import { useFileManager } from '@/hooks/useFileManager';
import { FileItem } from '@/types/fileTypes';
import Breadcrumb from './Breadcrumb';
import FileActions from './FileActions';
import FileGrid from './FileGrid';
import FileList from './FileList';
import CreateFolderDialog from './CreateFolderDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

interface FileManagerProps {
  basePath?: string;
}

const FileManager: React.FC<FileManagerProps> = ({ 
  basePath = '/app/luna'
}) => {
  const {
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
  } = useFileManager(basePath);

  const [createFolderOpen, setCreateFolderOpen] = useState(false);

  const handleFileClick = (file: FileItem) => {
    // For single click, just select the file
    toggleFileSelection(file.id);
  };

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateToFolder(file.path);
    } else {
      // In a real app, this would open/preview the file
      console.log('Opening file:', file.name);
    }
  };

  const handleCreateFolder = (name: string) => {
    createFolder(name);
  };

  // Click outside to clear selection
  const handleContainerClick = (e: React.MouseEvent) => {
    // Only clear if clicking directly on the container, not its children
    if (e.currentTarget === e.target) {
      clearSelection();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow border overflow-hidden">
      <div className="bg-gray-50 border-b px-4 py-3">
        <h1 className="text-lg font-semibold">File Manager</h1>
      </div>
      
      <Breadcrumb path={currentPath} onNavigate={navigateToFolder} />
      
      <FileActions 
        selectedCount={selectedFiles.length}
        viewMode={viewMode}
        onViewModeToggle={toggleViewMode}
        onUpload={uploadFiles}
        onDelete={deleteItems}
        onCreateFolderClick={() => setCreateFolderOpen(true)}
      />
      
      {error && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div 
        className="flex-1 overflow-auto"
        onClick={handleContainerClick}
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>This folder is empty</p>
          </div>
        ) : viewMode === 'grid' ? (
          <FileGrid 
            files={files}
            selectedFiles={selectedFiles}
            onFileClick={handleFileClick}
            onFileDoubleClick={handleFileDoubleClick}
            onFileSelect={toggleFileSelection}
          />
        ) : (
          <FileList 
            files={files}
            selectedFiles={selectedFiles}
            sortBy={sortBy}
            sortAscending={sortAscending}
            onSort={handleSort}
            onFileClick={handleFileClick}
            onFileDoubleClick={handleFileDoubleClick}
            onFileSelect={toggleFileSelection}
          />
        )}
      </div>
      
      <CreateFolderDialog 
        isOpen={createFolderOpen}
        onClose={() => setCreateFolderOpen(false)}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
};

export default FileManager;
