import type { Post } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = { post: Post };

export const loader: LoaderFunction = async ({ params }) => {
  const post = await db.post.findUnique({
    where: { id: params.postId },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const data: LoaderData = { post };
  return json(data);
};

export default function PostRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Here's your post:</p>

      <p>{data.post.content}</p>

      <Link to=".">{data.post.name} Permalink</Link>
    </div>
  );
}
