import { useRef, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import BookmarkItem from "./item";

interface SearchProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchProps) => {
  const [searchResult, setSearchResult] = useState<chrome.bookmarks.BookmarkTreeNode[]>([]);
  const searchValueRef = useRef<string>("");

  const search = () => {
    chrome.bookmarks.search(searchValueRef.current, (res) => {
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
                  searchValueRef.current = searchValue;
                  search();
                }
              }}
              className="flex-none"
              placeholder="输入标题网址进行搜索"
            />
          </div>
          <div className="mb-4 flex min-w-0 flex-1 flex-col space-y-4 overflow-auto px-4">
            {searchResult.map((item) => (
              <BookmarkItem key={item.id} data={item} refresh={search} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
