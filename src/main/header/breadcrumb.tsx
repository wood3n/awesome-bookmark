import React, { useMemo } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useBookmark } from "@/context/bookmark/use-bookmark";
import { flatBookmarkNode } from "@/lib/utils";

const BookmarkBreadcrumb = () => {
  const { folder, bookmarks, setFolder } = useBookmark();

  const flatedBookmarkNodes = useMemo(() => {
    if (!folder) {
      return [];
    }

    return flatBookmarkNode(folder, bookmarks);
  }, [folder, bookmarks]);

  return (
    <>
      {Boolean(flatedBookmarkNodes.length) && (
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      )}
      <Breadcrumb>
        <BreadcrumbList>
          {flatedBookmarkNodes.map((item, index) => {
            const isLast = index === flatedBookmarkNodes.length - 1;

            return (
              <React.Fragment key={item.id}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink className="cursor-pointer" onClick={() => setFolder(item)}>
                      {item.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="align=[]" />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default BookmarkBreadcrumb;
