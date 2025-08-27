import { ThemeProvider } from "@/context/theme";
import Main from "@/main";

import BookmarkFolder from "./context/bookmark";

const App = () => {
  return (
    <ThemeProvider storageKey="extension-ui-theme">
      <BookmarkFolder>
        <Main />
      </BookmarkFolder>
    </ThemeProvider>
  );
};

export default App;
