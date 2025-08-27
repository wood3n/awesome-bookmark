import { useMemo } from "react";

import { useBookmark } from "@/context/bookmark/use-bookmark";
import { findBookmarkNodeById } from "@/lib/utils";

import BookmarkUrlCard from "./url-card";

const Content = () => {
  const { folder, bookmarks } = useBookmark();

  const urls = useMemo(() => {
    const bookmarkNode = findBookmarkNodeById(bookmarks, folder?.id as string);

    return bookmarkNode?.children?.filter((item) => item.url);
  }, [folder, bookmarks]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 pb-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {urls?.map((item) => (
        <BookmarkUrlCard key={item.id} data={item} />
      ))}
    </div>
  );
};

export default Content;
