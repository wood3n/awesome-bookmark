import { useState } from "react";

import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { importBookmark } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const Import = ({ open, onOpenChange }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (file) {
      try {
        setLoading(true);
        const reader = new FileReader();
        reader.readAsText(file, "utf-8");
        reader.onload = async () => {
          if (reader.result) {
            const nodes = await importBookmark(reader.result as string);
            console.log(nodes);
            onOpenChange(false);
          }
        };

        reader.onerror = () => {
          setLoading(false);
        };
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>导入书签</DialogTitle>
        </DialogHeader>
        <Input id="picture" type="file" onChange={handleFileChange} />
        <DialogFooter>
          <Button disabled={loading} onClick={handleImport}>
            {loading && <Loader2Icon className="animate-spin" />}
            导入
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Import;
