import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentFolder?: chrome.bookmarks.BookmarkTreeNode;
  data?: chrome.bookmarks.BookmarkTreeNode;
}

const FormSchema = z.object({
  title: z.string().trim().min(1, {
    message: "请输入文件夹名称"
  })
});

const FolderForm = ({ open, onOpenChange, parentFolder, data }: Props) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: data?.title || ""
    }
  });

  const onSubmit = (formValues: z.infer<typeof FormSchema>) => {
    if (!data) {
      chrome.bookmarks.create({ parentId: parentFolder?.id, title: formValues.title });
    } else {
      chrome.bookmarks.update(data.id, { title: formValues.title });
    }

    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          form.reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{data ? "修改文件夹" : `添加文件夹到【${parentFolder?.title}】`}</DialogTitle>
        </DialogHeader>
        {/* form 必须包在这个层级，放在其他位置，submit 不会触发表单提交 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="请输入" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">取消</Button>
              </DialogClose>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FolderForm;
