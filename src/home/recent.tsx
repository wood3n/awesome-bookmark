import { useEffect, useState } from "react";

import { History as HistoryIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { faviconURL } from "@/lib/utils";

const Recent = () => {
  const [open, setOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);

  useEffect(() => {
    chrome.bookmarks.getRecent(20, (items) => {
      setBookmarks(items);
    });
  }, []);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="secondary" size="icon" onClick={() => setOpen(true)}>
            <HistoryIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>最近添加的书签</p>
        </TooltipContent>
      </Tooltip>
      <Dialog modal open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[800px] gap-1 p-0">
          <DialogHeader className="p-4">
            <DialogTitle>最近添加的书签</DialogTitle>
          </DialogHeader>
          <ScrollArea className="mb-4 h-[80vh] w-full px-4">
            <div className="flex flex-col space-y-4">
              {bookmarks.map((item) => (
                <Card key={item.id} className="p-2">
                  <CardContent className="flex items-center space-x-2 p-2">
                    <img width={24} src={faviconURL(item.url || "")} alt={item.title} />
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-xl hover:text-[#60a5fa] hover:underline"
                    >
                      {item.title || item.url}
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Recent;
