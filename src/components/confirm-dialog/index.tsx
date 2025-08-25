import type { VariantProps } from "class-variance-authority";

import { CircleAlert } from "lucide-react";

import { Button, buttonVariants } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmButtonVariant?: VariantProps<typeof buttonVariants>["variant"];
  onConfirm: () => void;
}

const ConfirmDialog = ({ open, onOpenChange, title, description, confirmButtonVariant, onConfirm }: Props) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div className="text-destructive mr-2">
              <CircleAlert />
            </div>
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取 消</Button>
          </DialogClose>
          <Button variant={confirmButtonVariant} onClick={onConfirm}>
            确 定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
