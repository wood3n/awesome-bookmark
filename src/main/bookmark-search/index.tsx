import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { faviconURL } from "@/lib/utils";

interface SearchProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchProps) => {
  const [searchResult, setSearchResult] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);

  const search = (searchValue: string) => {
    chrome.bookmarks.search(searchValue, (res) => {
      setSearchResult(res);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="h-[80vh] w-[800px] max-w-[800px] gap-1 p-0 sm:max-w-3xl">
        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <div className="p-4">
            <Input
              onChange={(e) => {
                const searchValue = e.target.value?.trim();
                if (searchValue) {
                  search(searchValue);
                }
              }}
              className="flex-none"
              placeholder="输入标题网址进行搜索"
            />
          </div>
          <div className="mb-4 flex min-w-0 flex-1 flex-col space-y-4 overflow-auto px-4">
            {searchResult.map((item) => (
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
