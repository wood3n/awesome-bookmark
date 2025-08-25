import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: string;
  data?: chrome.bookmarks.BookmarkTreeNode;
  refresh: () => void;
}

const FormSchema = z.object({
  title: z.string(),
  url: z.url({
    message: "请输入网址"
  })
});

const EditBookmark = ({ open, onOpenChange, folderId, data, refresh }: Props) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: data?.title || "",
      url: data?.url || ""
    }
  });

  const onSubmit = (formValues: z.infer<typeof FormSchema>) => {
    if (data) {
      chrome.bookmarks.update(data.id, { title: formValues.title, url: formValues.url });
    } else {
      chrome.bookmarks.create({ title: formValues.title, url: formValues.url, parentId: folderId });
    }

    onOpenChange(false);
    form.reset();
    refresh();
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
          <DialogTitle>{data ? "修改书签" : "添加书签"}</DialogTitle>
        </DialogHeader>
        {/* form 必须包在这个层级，放在其他位置，submit 不会触发表单提交 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2">标题</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2">网址</FormLabel>
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

export default EditBookmark;
