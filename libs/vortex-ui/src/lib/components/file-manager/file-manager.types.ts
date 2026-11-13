export interface VxFileItem {
  id: string;
  name: string;
  isDirectory: boolean;
  size?: number;
  modified?: Date | string;
  thumbnailUrl?: string;
  parentId?: string | null;
  mimeType?: string;
  [key: string]: unknown;
}

export type VxFileManagerView = 'list' | 'details' | 'thumbnails';

export interface VxFileManagerPermissions {
  readOnly?: boolean;
  allowUpload?: boolean;
  allowDownload?: boolean;
  allowRename?: boolean;
  allowDelete?: boolean;
  allowCreateFolder?: boolean;
}

export interface VxFileCreateEvent {
  name: string;
  isDirectory: boolean;
  parentId: string | null;
  file?: File;
}

export interface VxFileRenameEvent {
  item: VxFileItem;
  newName: string;
}

export interface VxFileDeleteEvent {
  items: VxFileItem[];
}
