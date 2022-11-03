import type { Post } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData, useParams } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = { post: Post };

export const loader: LoaderFunction = async ({ params }) => {
  const post = await db.post.findUnique({
    where: { id: params.postId },
  });

  if (!post) {
    throw new Response("Post not found", { status: 404 });
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

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();

  if (caught.status === 404) {
    return (
      <div className="">Couldn't find a post with id "{params.postId}"?</div>
    );
  }

  throw new Error(`Unhandled error: ${caught.status}`);
}

export function ErrorBoundary() {
  const { postId } = useParams();

  return (
    <div className="">{`There was an error loading post by the id ${postId}. Sorry.`}</div>
  );
}
