import { Braces, CodeXml } from "lucide-react";
import showdown from "showdown";

import MdIcon from "@/assets/icons/md.svg?react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBookmark } from "@/context/bookmark/use-bookmark";
import { downloadFileFromStr, exportBookmarkHtml } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const Export = ({ open, onOpenChange }: Props) => {
  const { bookmarks } = useBookmark();

  const exportJson = () => {
    downloadFileFromStr("bookmarks.json", JSON.stringify(bookmarks, null, 2));
  };

  const exportMarkdown = () => {
    const html = exportBookmarkHtml(bookmarks);
    const converter = new showdown.Converter();
    const markdown = converter.makeMarkdown(html);
    downloadFileFromStr("bookmarks.md", markdown);
  };

  const exportHTML = () => {
    downloadFileFromStr("bookmarks.html", exportBookmarkHtml(bookmarks));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>导出书签</DialogTitle>
        </DialogHeader>
        <Button variant="outline" onClick={exportJson}>
          <Braces />
          JSON
        </Button>
        <Button variant="outline" onClick={exportMarkdown}>
          <MdIcon />
          Markdown
        </Button>
        <Button variant="outline" onClick={exportHTML}>
          <CodeXml />
          HTML
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Export;
