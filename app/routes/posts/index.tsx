import type { Post } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { PostDisplay } from "~/components/post";
import { db } from "~/utils/db.server";

type LoaderData = { randomPost: Post };

export const loader: LoaderFunction = async () => {
  const count = await db.post.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomPost] = await db.post.findMany({
    take: 1,
    skip: randomRowNumber,
  });

  if (!randomPost) {
    throw new Response("No random post found", { status: 404 });
  }

  const data: LoaderData = { randomPost };
  return json(data);
};

export default function PostsIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return <PostDisplay post={data.randomPost} isOwner={false} />;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div className="">There are no post to display.</div>;
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

export function ErrorBoundary() {
  return (
    <div className="">Something went wrong trying to load random post.</div>
  );
}
