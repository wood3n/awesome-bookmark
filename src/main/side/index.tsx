import { useMemo, useState } from "react";

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
import { useBookmark } from "@/context/bookmark/use-bookmark";
import { cn, deepFilterBookmarkFolders } from "@/lib/utils";

import FolderForm from "./folder-form";
import FolderTree from "./folder-tree";

const Side = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [folderType, setFolderType] = useState<chrome.bookmarks.FolderType>("bookmarks-bar");
  const [openCreateFolder, setOpenCreateFolder] = useState<boolean>(false);

  const { bookmarks, folderTypeOptions, setFolder } = useBookmark();

  const handleFolderTypeChange = (v: string) => {
    setFolderType(v as chrome.bookmarks.FolderType);
    setFolder(bookmarks?.find((item) => item.folderType === v));
  };

  const bookmarkFolders = useMemo(() => {
    return deepFilterBookmarkFolders(bookmarks.find((item) => item.folderType === folderType)?.children || []);
  }, [bookmarks, folderType]);

  return (
    <Sidebar>
      <SidebarHeader className={cn("pt-4")}>
        <SidebarMenu>
          <SidebarMenuItem>
            <Select value={folderType} onValueChange={handleFolderTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {folderTypeOptions?.map((item) => (
                  <SelectItem key={item.folderType} value={item.folderType}>
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden p-2">
        <SidebarMenuButton
          variant="outline"
          tooltip="添加文件夹"
          className="flex-none"
          onClick={() => setOpenCreateFolder(true)}
        >
          <Plus />
          <span>添加文件夹</span>
        </SidebarMenuButton>
        <SidebarMenu>
          {bookmarkFolders.map((bookmarkFolder) => (
            <FolderTree
              key={bookmarkFolder.id}
              openKeys={openKeys}
              onOpenChange={setOpenKeys}
              bookmarkFolder={bookmarkFolder}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
      <FolderForm
        open={openCreateFolder}
        onOpenChange={setOpenCreateFolder}
        parentFolder={bookmarks?.find((item) => item.folderType === "bookmarks-bar")}
      />
    </Sidebar>
  );
};
export default Side;
