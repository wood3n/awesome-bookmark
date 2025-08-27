import { createContext } from "react";

export interface FolderTypeOption {
  id: string;
  title: string;
  folderType: chrome.bookmarks.FolderType;
}

export interface BookmarkState {
  bookmarks: chrome.bookmarks.BookmarkTreeNode[];
  folderTypeOptions: FolderTypeOption[];
  folder: chrome.bookmarks.BookmarkTreeNode | undefined;
  setFolder: (folder: chrome.bookmarks.BookmarkTreeNode | undefined) => void;
}

export const BookmarkContext = createContext<BookmarkState>({
  bookmarks: [],
  folderTypeOptions: [],
  folder: undefined,
  setFolder: () => null
});
