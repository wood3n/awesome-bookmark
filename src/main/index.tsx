import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import Content from "./content";
import Header from "./header";
import Side from "./side";

const Main = () => {
  return (
    <SidebarProvider>
      <Side />
      <SidebarInset>
        <Header />
        <Content />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Main;
