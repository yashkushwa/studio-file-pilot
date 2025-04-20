
import { Plus, Upload, Trash, Grid2X2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ViewMode } from '@/types/fileTypes';
import { useRef } from 'react';

interface FileActionsProps {
  selectedCount: number;
  viewMode: ViewMode;
  onViewModeToggle: () => void;
  onUpload: (files: FileList) => void;
  onDelete: () => void;
  onCreateFolderClick: () => void;
}

const FileActions: React.FC<FileActionsProps> = ({
  selectedCount,
  viewMode,
  onViewModeToggle,
  onUpload,
  onDelete,
  onCreateFolderClick
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 border-b bg-white">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCreateFolderClick}
          className="flex items-center"
        >
          <Plus className="mr-1 h-4 w-4" />
          New Folder
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center"
        >
          <Upload className="mr-1 h-4 w-4" />
          Upload
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            multiple
          />
        </Button>
        
        {selectedCount > 0 && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <Button 
              variant="destructive" 
              size="sm"
              onClick={onDelete}
              className="flex items-center"
            >
              <Trash className="mr-1 h-4 w-4" />
              Delete ({selectedCount})
            </Button>
          </>
        )}
      </div>
      
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewModeToggle}
          className="flex items-center"
        >
          {viewMode === 'list' ? (
            <>
              <Grid2X2 className="h-4 w-4" />
              <span className="ml-1 sr-only">Grid View</span>
            </>
          ) : (
            <>
              <List className="h-4 w-4" />
              <span className="ml-1 sr-only">List View</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileActions;
