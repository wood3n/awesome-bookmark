import { useMemo } from "react";

import BookmarkUrlCard from "./bookmark-url-card";

interface Props {
  data: chrome.bookmarks.BookmarkTreeNode;
}

const Content = ({ data }: Props) => {
  const urls = useMemo(() => {
    return data?.children?.filter((item) => item.url);
  }, [data]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-3 gap-4 px-4 pb-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {urls?.map((item) => (
        <BookmarkUrlCard key={item.id} data={item} />
      ))}
    </div>
  );
};

export default Content;
