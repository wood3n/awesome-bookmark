import { use } from "react";

import { BookmarkContext } from "./context";

export const useBookmark = () => {
  return use(BookmarkContext);
};
