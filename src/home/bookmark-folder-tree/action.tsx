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

import EditBookmark from "../bookmark-action";
import EditFolder from "../bookmark-folder-action";

interface Props {
  data: chrome.bookmarks.BookmarkTreeNode;
  children: React.ReactNode;
  refresh: () => void;
}

const ItemAction = ({ data, children, refresh }: Props) => {
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
            编辑
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
      <EditFolder open={openEditDialog} onOpenChange={setOpenEditDialog} data={data} refresh={refresh} />
      <EditBookmark
        open={openCreateBookmark}
        onOpenChange={setOpenCreateBookmark}
        folderId={data.id}
        refresh={refresh}
      />
      <EditFolder open={openCreateFolder} onOpenChange={setOpenCreateFolder} folderId={data.id} refresh={refresh} />
      <ConfirmDialog
        title={`删除文件夹${data?.title}？`}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        confirmButtonVariant="destructive"
        onConfirm={() => {
          chrome.bookmarks.removeTree(data.id);
          setOpenDeleteDialog(false);
          refresh();
        }}
      />
    </>
  );
};

export default ItemAction;
