import { useState } from "react";

import { Pencil, Trash2 } from "lucide-react";

import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { faviconURL } from "@/lib/utils";

import EditBookmark from "../bookmark-form-dialog";

interface Props {
  data: chrome.bookmarks.BookmarkTreeNode;
  refresh: VoidFunction;
}

const BookmarkItem = ({ data, refresh }: Props) => {
  const [openEditBookmark, setOpenEditBookmark] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <Card className="group p-2">
        <CardContent className="flex h-[48px] items-center justify-between p-0">
          <div className="flex min-w-0 flex-1 items-center space-x-2 px-2">
            <img width={24} src={faviconURL(data.url || "")} alt={data.title} />
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-xl hover:text-[#60a5fa] hover:underline"
            >
              {data.title || data.url}
            </a>
          </div>
          <div className="animate-fade mx-2 hidden items-center space-x-1 group-hover:flex group-hover:flex-none">
            <Button variant="ghost" size="sm" onClick={() => setOpenEditBookmark(true)}>
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-destructive"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <Trash2 />
            </Button>
          </div>
        </CardContent>
      </Card>
      <EditBookmark
        open={openEditBookmark}
        onOpenChange={setOpenEditBookmark}
        formInitData={data}
        afterSubmit={refresh}
      />
      <ConfirmDialog
        title={`删除书签${data?.title ? `【${data.title}】` : ""}？`}
        description={data?.url}
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

export default BookmarkItem;
