import { FileItem } from "@/types/fileTypes";

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

export const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined) return '-';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const getFileTypeIcon = (file: FileItem): string => {
  if (file.type === 'folder') return 'folder';
  
  const extension = file.extension || getFileExtension(file.name);
  
  // Image files
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return 'file-image';
  }
  
  // Document files
  if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(extension)) {
    return 'file-text';
  }
  
  // Video files
  if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
    return 'file-video';
  }
  
  // Audio files
  if (['mp3', 'wav', 'ogg'].includes(extension)) {
    return 'file-audio';
  }
  
  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return 'file-archive';
  }
  
  return 'file';
};

export const sortFiles = (files: FileItem[], sortBy: string, ascending: boolean): FileItem[] => {
  return [...files].sort((a, b) => {
    // Folders always first
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1;
    }

    switch (sortBy) {
      case 'name':
        return ascending ? 
          a.name.localeCompare(b.name) : 
          b.name.localeCompare(a.name);
      
      case 'modified':
        return ascending ? 
          new Date(a.modified).getTime() - new Date(b.modified).getTime() : 
          new Date(b.modified).getTime() - new Date(a.modified).getTime();
      
      case 'size':
        const sizeA = a.size || 0;
        const sizeB = b.size || 0;
        return ascending ? sizeA - sizeB : sizeB - sizeA;
      
      case 'type':
        const extA = a.extension || '';
        const extB = b.extension || '';
        return ascending ? 
          extA.localeCompare(extB) : 
          extB.localeCompare(extA);
      
      default:
        return 0;
    }
  });
};

export const getParentPath = (path: string): string => {
  const parts = path.split('/').filter(Boolean);
  
  if (parts.length <= 1) {
    // If we're already at root or first level, keep at root
    return '/';
  }
  
  parts.pop(); // Remove the last element
  return '/' + parts.join('/');
};

export const buildBreadcrumbs = (path: string): { name: string, path: string }[] => {
  const parts = path.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', path: '/' }];
  
  let currentPath = '';
  for (const part of parts) {
    currentPath += '/' + part;
    breadcrumbs.push({
      name: part,
      path: currentPath
    });
  }
  
  return breadcrumbs;
};
