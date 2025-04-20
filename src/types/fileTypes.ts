
export type FileItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified: string;
  path: string;
  extension?: string;
};

export type SortOption = 'name' | 'modified' | 'size' | 'type';
export type ViewMode = 'list' | 'grid';
