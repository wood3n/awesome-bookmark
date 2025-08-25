import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/home";

const App = () => {
  return (
    <ThemeProvider storageKey="extension-ui-theme">
      <Home />
    </ThemeProvider>
  );
};

export default App;
