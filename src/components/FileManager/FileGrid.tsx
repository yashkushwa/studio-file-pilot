
import { FileItem } from '@/types/fileTypes';
import { formatFileSize, getFileTypeIcon } from '@/utils/fileUtils';
import { CheckCircle, File, FileImage, Folder, FolderOpen } from 'lucide-react';

interface FileGridProps {
  files: FileItem[];
  selectedFiles: string[];
  onFileClick: (file: FileItem) => void;
  onFileDoubleClick: (file: FileItem) => void;
  onFileSelect: (fileId: string) => void;
}

const FileGrid: React.FC<FileGridProps> = ({
  files,
  selectedFiles,
  onFileClick,
  onFileDoubleClick,
  onFileSelect
}) => {
  const renderFileIcon = (file: FileItem) => {
    const iconSize = "h-10 w-10";
    
    if (file.type === 'folder') {
      return <Folder className={`${iconSize} text-amber-500`} />;
    }
    
    const iconType = getFileTypeIcon(file);
    
    switch (iconType) {
      case 'file-image':
        return <FileImage className={`${iconSize} text-blue-500`} />;
      default:
        return <File className={`${iconSize} text-gray-500`} />;
    }
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
      {files.map((file) => {
        const isSelected = selectedFiles.includes(file.id);
        
        return (
          <div
            key={file.id}
            className={`
              relative flex flex-col items-center p-3 rounded-md border cursor-pointer
              ${isSelected ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50 border-transparent'}
            `}
            onClick={(e) => {
              onFileClick(file);
              e.stopPropagation();
            }}
            onDoubleClick={() => onFileDoubleClick(file)}
          >
            <div className="absolute top-2 right-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onFileSelect(file.id)}
                className="sr-only"
                id={`select-${file.id}`}
              />
              <label 
                htmlFor={`select-${file.id}`}
                className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                  isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}
                onClick={(e) => {
                  onFileSelect(file.id);
                  e.stopPropagation();
                }}
              >
                {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
              </label>
            </div>
            
            <div className="mb-2">
              {renderFileIcon(file)}
            </div>
            
            <div className="text-center">
              <div className="truncate w-full text-sm font-medium" title={file.name}>
                {file.name}
              </div>
              <div className="text-xs text-gray-500">
                {file.type === 'file' ? formatFileSize(file.size) : ''}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileGrid;
