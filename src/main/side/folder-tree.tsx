import { ChevronRight, Folder, FolderClosed, FolderOpen } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { useBookmark } from "@/context/bookmark/use-bookmark";
import { cn } from "@/lib/utils";

import ActionMenu from "./folder-action-menu";

interface Props {
  bookmarkFolder: chrome.bookmarks.BookmarkTreeNode;
  openKeys: string[];
  onOpenChange: (keys: string[]) => void;
}

const FolderTree = ({ bookmarkFolder, openKeys, onOpenChange }: Props) => {
  const isOpen = openKeys.includes(bookmarkFolder.id);

  const { folder: currentFolder, setFolder } = useBookmark();

  const isActive = currentFolder?.id === bookmarkFolder.id;

  const handleChangeFolder = () => {
    setFolder(bookmarkFolder);
  };

  if (!bookmarkFolder?.children?.length) {
    return (
      <SidebarMenuItem>
        <ActionMenu bookmarkFolder={bookmarkFolder}>
          <SidebarMenuButton isActive={isActive} onClick={handleChangeFolder}>
            <Folder />
            {bookmarkFolder?.title}
          </SidebarMenuButton>
        </ActionMenu>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        open={openKeys.includes(bookmarkFolder.id)}
        onOpenChange={(open) =>
          onOpenChange(open ? [...openKeys, bookmarkFolder.id] : openKeys.filter((key) => key !== bookmarkFolder.id))
        }
      >
        <ActionMenu bookmarkFolder={bookmarkFolder}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton isActive={isActive} onClick={handleChangeFolder}>
              {isOpen ? <FolderOpen /> : <FolderClosed />}
              <span>{bookmarkFolder.title}</span>
              {bookmarkFolder.children?.length ? (
                <ChevronRight className={cn("ml-auto transition-transform duration-200", isOpen && "rotate-90")} />
              ) : null}
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </ActionMenu>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            {bookmarkFolder.children.map((subItem) => {
              return (
                <FolderTree key={subItem.id} openKeys={openKeys} onOpenChange={onOpenChange} bookmarkFolder={subItem} />
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default FolderTree;
