import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const Import = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>导入书签</DialogTitle>
        </DialogHeader>
        <Input id="picture" type="file" />
        <DialogFooter>
          <Button>导入</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Import;
