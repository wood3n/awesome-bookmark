import { useState } from "react";

import { BookmarkPlus, FolderPlus, Pencil, Trash2 } from "lucide-react";

import ConfirmDialog from "@/components/confirm-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from "@/components/ui/context-menu";

import BookmarkFormDialog from "../bookmark-form-dialog";
import FolderForm from "./folder-form";

interface Props {
  bookmarkFolder: chrome.bookmarks.BookmarkTreeNode;
  children: React.ReactNode;
}

const FolderActionMenu = ({ bookmarkFolder, children }: Props) => {
  const [openCreateBookmark, setOpenCreateBookmark] = useState(false);
  const [openCreateFolder, setOpenCreateFolder] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem className="flex items-center" onClick={() => setOpenEditDialog(true)}>
            <Pencil />
            修改名称
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="flex items-center" onClick={() => setOpenCreateBookmark(true)}>
            <BookmarkPlus />
            添加书签
          </ContextMenuItem>
          <ContextMenuItem className="flex items-center" onClick={() => setOpenCreateFolder(true)}>
            <FolderPlus />
            添加文件夹
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            className="flex items-center"
            onClick={() => setOpenDeleteDialog(true)}
            variant="destructive"
          >
            <Trash2 />
            删除
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <FolderForm open={openEditDialog} onOpenChange={setOpenEditDialog} data={bookmarkFolder} />
      <FolderForm open={openCreateFolder} onOpenChange={setOpenCreateFolder} parentFolder={bookmarkFolder} />
      <BookmarkFormDialog
        open={openCreateBookmark}
        onOpenChange={setOpenCreateBookmark}
        parentFolder={bookmarkFolder}
      />
      <ConfirmDialog
        title={`删除文件夹${bookmarkFolder?.title}？`}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        confirmButtonVariant="destructive"
        onConfirm={() => {
          chrome.bookmarks.removeTree(bookmarkFolder.id);
          setOpenDeleteDialog(false);
        }}
      />
    </>
  );
};

export default FolderActionMenu;
