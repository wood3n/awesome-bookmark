import { ChevronRight, Folder, FolderClosed, FolderOpen } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import ItemAction from "./action";

interface Props {
  data: chrome.bookmarks.BookmarkTreeNode;
  activeKey?: string;
  onItemClick?: (item: chrome.bookmarks.BookmarkTreeNode) => void;
  openKeys: string[];
  onOpenChange: (keys: string[]) => void;
  refresh: () => void;
}

const BookmarkFolderTree = ({ data, activeKey, onItemClick, openKeys, onOpenChange, refresh }: Props) => {
  const isOpen = openKeys.includes(data.id);
  const isActive = activeKey === data.id;

  if (!data?.children?.length) {
    return (
      <SidebarMenuItem>
        <ItemAction data={data} refresh={refresh}>
          <SidebarMenuButton isActive={isActive} onClick={() => onItemClick?.(data)}>
            <Folder />
            {data?.title}
          </SidebarMenuButton>
        </ItemAction>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        open={openKeys.includes(data.id)}
        onOpenChange={(open) => onOpenChange(open ? [...openKeys, data.id] : openKeys.filter((key) => key !== data.id))}
      >
        <ItemAction data={data} refresh={refresh}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton isActive={isActive} onClick={() => onItemClick?.(data)}>
              {isOpen ? <FolderOpen /> : <FolderClosed />}
              <span>{data.title}</span>
              {data.children?.length ? (
                <ChevronRight className={cn("ml-auto transition-transform duration-200", isOpen && "rotate-90")} />
              ) : null}
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </ItemAction>
        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            {data.children.map((subItem) => {
              return (
                <BookmarkFolderTree
                  key={subItem.id}
                  activeKey={activeKey}
                  onItemClick={onItemClick}
                  openKeys={openKeys}
                  onOpenChange={onOpenChange}
                  data={subItem}
                  refresh={refresh}
                />
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default BookmarkFolderTree;
