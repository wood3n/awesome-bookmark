import { useState } from "react";

import { Plus } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import EditFolder from "./bookmark-folder-action";
import BookmarkFolderTree from "./bookmark-folder-tree";

interface Props {
  folderTypes: Pick<chrome.bookmarks.BookmarkTreeNode, "folderType" | "title">[];
  rootFolderId: string;
  folderType: chrome.bookmarks.FolderType;
  onFolderTypeChange: (folderType: chrome.bookmarks.FolderType) => void;
  bookmarkFolders: chrome.bookmarks.BookmarkTreeNode[];
  activeKey?: string;
  onItemClick?: (item: chrome.bookmarks.BookmarkTreeNode) => void;
  refresh: () => void;
}

const Side = ({
  folderTypes,
  rootFolderId,
  folderType,
  onFolderTypeChange,
  bookmarkFolders,
  activeKey,
  onItemClick,
  refresh
}: Props) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [openCreateFolder, setOpenCreateFolder] = useState<boolean>(false);

  return (
    <Sidebar>
      <SidebarHeader className={cn("pt-4")}>
        <SidebarMenu>
          <SidebarMenuItem>
            <Select value={folderType} onValueChange={onFolderTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {folderTypes?.map((item) => (
                  <SelectItem key={item.folderType} value={item.folderType as string}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden p-2">
        <SidebarMenuButton variant="outline" tooltip="添加文件夹" onClick={() => setOpenCreateFolder(true)}>
          <Plus />
          <span>添加文件夹</span>
        </SidebarMenuButton>
        <SidebarMenu>
          {bookmarkFolders.map((item) => (
            <BookmarkFolderTree
              key={item.id}
              activeKey={activeKey}
              onItemClick={onItemClick}
              openKeys={openKeys}
              onOpenChange={setOpenKeys}
              data={item}
              refresh={refresh}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
      <EditFolder
        open={openCreateFolder}
        onOpenChange={setOpenCreateFolder}
        folderId={rootFolderId}
        refresh={refresh}
      />
    </Sidebar>
  );
};
export default Side;
