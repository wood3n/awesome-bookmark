import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

interface Props {
  data: chrome.bookmarks.BookmarkTreeNode[];
  onClick: (item: chrome.bookmarks.BookmarkTreeNode) => void;
}

const BookmarkBreadcrumb = ({ data, onClick }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {data.map((item, index) => {
          const isLast = index === data.length - 1;

          return (
            <React.Fragment key={item.id}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink className="cursor-pointer" onClick={() => onClick(item)}>
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
  );
};

export default BookmarkBreadcrumb;
