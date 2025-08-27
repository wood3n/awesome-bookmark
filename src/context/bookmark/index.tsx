import { useEffect, useMemo, useState } from "react";

import { BookmarkContext, type FolderTypeOption } from "./context";

interface Props {
  children: React.ReactNode;
}

const getBookmarks = async () => {
  const bookmarks = await chrome.bookmarks.getTree();
  // the first folder is the root folder, we should get children
  return bookmarks?.[0]?.children;
};

const BookmarkProvider = ({ children }: Props) => {
  const [bookmarks, setBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
  const [folderTypeOptions, setFolderTypeOptions] = useState<FolderTypeOption[]>([]);
  const [folder, setFolder] = useState<chrome.bookmarks.BookmarkTreeNode | undefined>();

  const initBookmarks = async () => {
    const bookmarks = await getBookmarks();
    setBookmarks(bookmarks || []);
    setFolder(bookmarks?.[0]);
    setFolderTypeOptions(
      bookmarks?.map((item) => ({
        id: item.id,
        title: item.title,
        folderType: item.folderType as chrome.bookmarks.FolderType
      })) || []
    );
  };

  const refresh = async () => {
    const bookmarks = await getBookmarks();
    setBookmarks(bookmarks || []);
  };

  useEffect(() => {
    initBookmarks();

    chrome.bookmarks.onChanged.addListener(refresh);

    chrome.bookmarks.onChildrenReordered.addListener(refresh);

    chrome.bookmarks.onCreated.addListener(refresh);

    chrome.bookmarks.onRemoved.addListener(refresh);
  }, []);

  const contextValue = useMemo(
    () => ({ bookmarks, folderTypeOptions, folder, setFolder }),
    [bookmarks, folderTypeOptions, folder]
  );

  return <BookmarkContext value={contextValue}>{children}</BookmarkContext>;
};

export default BookmarkProvider;
