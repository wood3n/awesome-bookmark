import { useMemo, useState } from "react";

import { Plus } from "lucide-react";

import ExportIcon from "@/assets/icons/export.svg?react";
import ImportIcon from "@/assets/icons/import.svg?react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useBookmark } from "@/context/bookmark/use-bookmark";
import { cn, deepFilterBookmarkFolders, findBookmarkNodeById, flatBookmarkNode } from "@/lib/utils";

import { Button } from "../components/ui/button";
import EditBookmark from "./bookmark-action";
import Export from "./bookmark-action/export";
import ImportBookmark from "./bookmark-action/import";
import BookmarkBreadcrumb from "./bookmark-breadcrumb";
import Content from "./content";
import Recent from "./recent";
import Side from "./side";

const Home = () => {
  const [folderType, setFolderType] = useState<chrome.bookmarks.FolderType>("bookmarks-bar");
  const [openCreateBookmark, setOpenCreateBookmark] = useState(false);
  const [openExportBookmark, setOpenExportBookmark] = useState(false);
  const [openImportBookmark, setOpenImportBookmark] = useState(false);

  const { bookmarks, setFolder } = useBookmark();

  const flatedBookmarkNode = useMemo(() => {
    if (!currentFolder) {
      return [];
    }

    return flatBookmarkNode(currentFolder, bookmarks);
  }, [currentFolder, bookmarks]);

  const folderTypes = useMemo(() => {
    return bookmarks?.map((item) => ({
      title: item.title,
      folderType: item.folderType
    }));
  }, [bookmarks]);

  const bookmarkFolders = useMemo(() => {
    return deepFilterBookmarkFolders(bookmarks.find((item) => item.folderType === folderType)?.children || []);
  }, [bookmarks, folderType]);

  return (
    <SidebarProvider>
      <Side
        rootFolderId={bookmarks.find((item) => item.folderType === folderType)?.id as string}
        folderTypes={folderTypes}
        folderType={folderType}
        onFolderTypeChange={(v) => {
          setFolderType(v);
          setCurrentFolder(bookmarks.find((item) => item.folderType === v)?.children?.[0]);
        }}
        activeKey={currentFolder?.id}
        onItemClick={setCurrentFolder}
        bookmarkFolders={bookmarkFolders}
      />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            {Boolean(flatedBookmarkNode.length) && (
              <Separator orientation="vertical" className={cn("mr-2 data-[orientation=vertical]:h-4")} />
            )}
            <BookmarkBreadcrumb data={flatedBookmarkNode} onClick={setCurrentFolder} />
          </div>
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" onClick={() => setOpenCreateBookmark(true)}>
                  <Plus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>添加书签</p>
              </TooltipContent>
            </Tooltip>
            <Recent />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" onClick={() => setOpenExportBookmark(true)}>
                  <ExportIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>导出书签</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" onClick={() => setOpenImportBookmark(true)}>
                  <ImportIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>导入书签</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>
        <Content data={findBookmarkNodeById(bookmarks, currentFolder?.id)} />
      </SidebarInset>
      {Boolean(currentFolder?.id) && (
        <EditBookmark
          open={openCreateBookmark}
          onOpenChange={setOpenCreateBookmark}
          folderId={currentFolder?.id as string}
          refresh={getBookmarks}
        />
      )}
      <Export bookmarks={bookmarks} open={openExportBookmark} onOpenChange={setOpenExportBookmark} />
      <ImportBookmark open={openImportBookmark} onOpenChange={setOpenImportBookmark} />
    </SidebarProvider>
  );
};

export default Home;
