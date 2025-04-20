
import { FileItem, SortOption } from '@/types/fileTypes';
import { formatFileSize, formatDate, getFileTypeIcon } from '@/utils/fileUtils';
import { ArrowDown, ArrowUp, CheckCircle, File, FileImage, Folder } from 'lucide-react';
import React from 'react';

interface FileListProps {
  files: FileItem[];
  selectedFiles: string[];
  sortBy: SortOption;
  sortAscending: boolean;
  onSort: (field: SortOption) => void;
  onFileClick: (file: FileItem) => void;
  onFileDoubleClick: (file: FileItem) => void;
  onFileSelect: (fileId: string) => void;
}

const FileList: React.FC<FileListProps> = ({
  files,
  selectedFiles,
  sortBy,
  sortAscending,
  onSort,
  onFileClick,
  onFileDoubleClick,
  onFileSelect
}) => {
  const renderSortIcon = (field: SortOption) => {
    if (sortBy !== field) return null;
    
    return sortAscending ? (
      <ArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4" />
    );
  };
  
  const renderFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="h-5 w-5 text-amber-500" />;
    }
    
    const iconType = getFileTypeIcon(file);
    
    switch (iconType) {
      case 'file-image':
        return <FileImage className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="w-10 px-3 py-2">
              {/* Checkbox column */}
            </th>
            <th 
              className="px-3 py-2 text-left cursor-pointer"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                Name
                {renderSortIcon('name')}
              </div>
            </th>
            <th 
              className="px-3 py-2 text-left cursor-pointer"
              onClick={() => onSort('modified')}
            >
              <div className="flex items-center">
                Modified
                {renderSortIcon('modified')}
              </div>
            </th>
            <th 
              className="px-3 py-2 text-left cursor-pointer"
              onClick={() => onSort('size')}
            >
              <div className="flex items-center">
                Size
                {renderSortIcon('size')}
              </div>
            </th>
            <th 
              className="px-3 py-2 text-left cursor-pointer"
              onClick={() => onSort('type')}
            >
              <div className="flex items-center">
                Type
                {renderSortIcon('type')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file) => {
            const isSelected = selectedFiles.includes(file.id);
            
            return (
              <tr 
                key={file.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
                onClick={() => onFileClick(file)}
                onDoubleClick={() => onFileDoubleClick(file)}
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onFileSelect(file.id)}
                    className="sr-only"
                    id={`select-list-${file.id}`}
                  />
                  <label 
                    htmlFor={`select-list-${file.id}`}
                    className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                      isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileSelect(file.id);
                    }}
                  >
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </label>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="mr-2">{renderFileIcon(file)}</span>
                    <span className="font-medium">{file.name}</span>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(file.modified)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {file.type === 'file' ? formatFileSize(file.size) : '—'}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {file.type === 'folder' ? 'Folder' : (file.extension || '—')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
