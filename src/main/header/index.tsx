import { useState } from "react";

import { Plus, Search } from "lucide-react";

import ExportIcon from "@/assets/icons/export.svg?react";
import ImportIcon from "@/assets/icons/import.svg?react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useBookmark } from "@/context/bookmark/use-bookmark";

import BookmarkFormDialog from "../bookmark-form-dialog";
import BookmarkRecent from "../bookmark-recent";
import BookmarkSearchDialog from "../bookmark-search";
import BookmarkBreadcrumb from "./breadcrumb";
import ExportBookmark from "./export";
import ImportBookmark from "./import";

const Header = () => {
  const [openExportBookmark, setOpenExportBookmark] = useState(false);
  const [openImportBookmark, setOpenImportBookmark] = useState(false);
  const [openCreateBookmark, setOpenCreateBookmark] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const { folder } = useBookmark();

  return (
    <>
      <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <BookmarkBreadcrumb />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="icon" onClick={() => setOpenSearch(true)}>
            <Search />
          </Button>
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
          <BookmarkRecent />
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
      <ExportBookmark open={openExportBookmark} onOpenChange={setOpenExportBookmark} />
      <ImportBookmark open={openImportBookmark} onOpenChange={setOpenImportBookmark} />
      {Boolean(folder?.id) && (
        <BookmarkFormDialog open={openCreateBookmark} onOpenChange={setOpenCreateBookmark} parentFolder={folder} />
      )}
      <BookmarkSearchDialog open={openSearch} onOpenChange={setOpenSearch} />
    </>
  );
};

export default Header;
