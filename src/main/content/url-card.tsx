import { useEffect, useState } from "react";

import { Pencil, Trash2 } from "lucide-react";

import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { faviconURL, getSiteMeta } from "@/lib/utils";

import EditBookmark from "../bookmark-form-dialog";
import CardSkeleton from "./card-skeleton";

interface Props {
  data: chrome.bookmarks.BookmarkTreeNode;
}

interface SiteMeta {
  title: string;
  description: string;
  url: string;
}

const BookmarkUrlCard = ({ data }: Props) => {
  const [siteData, setSiteData] = useState<SiteMeta>();
  const [loading, setLoading] = useState(false);
  const [openEditBookmark, setOpenEditBookmark] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const getSiteData = async () => {
    setLoading(true);
    try {
      const res = await getSiteMeta(data.url as string);

      setSiteData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data.url) {
      getSiteData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.url]);

  if (!siteData && loading) {
    return <CardSkeleton />;
  }

  return (
    <Card className="group animate-fade @container/card relative min-h-[150px] overflow-hidden">
      <CardHeader className="flex items-start justify-between space-x-2">
        <CardTitle className="min-w-0 flex-1 truncate text-xl font-semibold tabular-nums hover:text-[#60a5fa] hover:underline @[250px]/card:text-3xl">
          <a href={data.url} target="_blank" rel="noopener noreferrer">
            {siteData?.title || siteData?.url || data.title}
          </a>
        </CardTitle>
        <div className="h-[42px] w-[42px]">
          <img width="100%" height="100%" alt={siteData?.title} src={faviconURL(data.url as string)} />
        </div>
      </CardHeader>
      <CardFooter className="line-clamp-[2] flex-col items-start gap-1.5 text-sm">
        {siteData?.description || siteData?.url || data.url}
      </CardFooter>
      <div
        aria-hidden="true"
        className="absolute right-0 bottom-0 left-0 m-2 flex translate-y-6 transform items-center justify-end space-x-4 rounded-xl bg-transparent px-4 py-2 opacity-0 backdrop-blur transition group-hover:flex group-hover:translate-y-0 group-hover:opacity-100"
      >
        <Button variant="secondary" className="w-1/2 flex-1" onClick={() => setOpenEditBookmark(true)}>
          <Pencil />修 改
        </Button>
        <Button variant="destructive" className="w-1/2 flex-1" onClick={() => setOpenDeleteDialog(true)}>
          <Trash2 />删 除
        </Button>
      </div>
      <EditBookmark open={openEditBookmark} onOpenChange={setOpenEditBookmark} formInitData={data} />
      <ConfirmDialog
        title={`删除该书签？`}
        description={data?.url}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        confirmButtonVariant="destructive"
        onConfirm={() => {
          chrome.bookmarks.removeTree(data.id);
          setOpenDeleteDialog(false);
        }}
      />
    </Card>
  );
};

export default BookmarkUrlCard;
