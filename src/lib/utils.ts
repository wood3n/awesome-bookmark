import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const findBookmarkNodeById = (
  nodes: chrome.bookmarks.BookmarkTreeNode[],
  id: string
): chrome.bookmarks.BookmarkTreeNode | undefined => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const found = findBookmarkNodeById(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};

export const flatBookmarkNode = (
  bookmarkNode: chrome.bookmarks.BookmarkTreeNode,
  bookmarks: chrome.bookmarks.BookmarkTreeNode[],
  result: chrome.bookmarks.BookmarkTreeNode[] = []
) => {
  result.unshift(bookmarkNode);

  if (bookmarkNode.parentId) {
    const parentNode = findBookmarkNodeById(bookmarks, bookmarkNode.parentId);
    if (parentNode) {
      flatBookmarkNode(parentNode, bookmarks, result);
    }
  }
  return result;
};

export const deepFilterBookmarkFolders = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
  return nodes.reduce<chrome.bookmarks.BookmarkTreeNode[]>((acc, item) => {
    if (Array.isArray(item.children)) {
      acc.push({
        ...item,
        children: deepFilterBookmarkFolders(item.children)
      });
    }

    return acc;
  }, []);
};

export async function getSiteMeta(url: string) {
  const res = await fetch(url);
  const html = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const title = doc.querySelector("title")?.innerText || "";
  // @ts-ignore content is not defined
  const description = doc.querySelector('meta[name="description"]')?.content || "";

  return { title, description, url };
}

export function faviconURL(url: string) {
  const urlInstance = new URL(chrome.runtime.getURL("/_favicon/"));
  urlInstance.searchParams.set("pageUrl", url); // this encodes the URL as well
  urlInstance.searchParams.set("size", "128");
  return urlInstance.toString();
}

export function downloadFileFromStr(filename: string, content: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content]));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function toSeconds(ts: number | undefined) {
  if (!ts) return "";
  const n = Number(ts);
  if (Number.isNaN(n)) return "";
  // 如果大于 1e12，认为是毫秒 -> 转秒；如果小于 1e11 认为是秒
  return n > 1e12 ? Math.floor(n / 1000) : Math.floor(n);
}

export function exportBookmarkHtml(bookmarks: chrome.bookmarks.BookmarkTreeNode[]) {
  const htmlHeader = `
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>`;

  const renderDl = (nodes: chrome.bookmarks.BookmarkTreeNode[]): string[] =>
    nodes.map((item) => {
      if (Array.isArray(item.children)) {
        return `<DL><p>
        <DT><H3 ADD_DATE="${toSeconds(item.dateAdded)}" LAST_MODIFIED="${toSeconds(item.dateGroupModified)}" PERSONAL_TOOLBAR_FOLDER="true">${item.title}</H3>
        <DL><p>
        ${renderDl(item.children).join("")}
        </DL><p>
        `;
      }

      return `<DT><A HREF="${item.url}" ADD_DATE="${toSeconds(item.dateAdded)}">${item.title}</A>\n`;
    });

  return `
  ${htmlHeader}
  ${renderDl(bookmarks).join("")}
  `;
}

export async function importBookmark(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const rootDl = doc.querySelector("dl");
  if (!rootDl) return [];

  const parseDl = async (dlElement: HTMLDListElement, parentId: string = "1") => {
    const childList = Array.from(dlElement.children);
    console.log(childList);

    let parentFolder: chrome.bookmarks.BookmarkTreeNode | undefined;
    for (const child of childList) {
      if (child.tagName === "DT") {
        const h3 = child.querySelector("h3");
        const a = child.querySelector("a");

        // root bookmark bar folder
        const isBookmarkBarFolder = h3?.getAttribute("personal_toolbar_folder");

        if (h3) {
          if (!isBookmarkBarFolder) {
            parentFolder = await chrome.bookmarks.create({
              parentId,
              title: h3.textContent || "未命名文件夹"
            });
          }
        } else if (a) {
          await chrome.bookmarks.create({
            parentId,
            title: a.textContent || undefined,
            url: a.getAttribute("href") as string
          });
        }
      } else if (child.tagName === "DL") {
        parseDl(child as HTMLDListElement);
      }
    }
  };

  await parseDl(rootDl);
}
