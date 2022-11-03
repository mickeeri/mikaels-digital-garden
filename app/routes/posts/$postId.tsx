import type { Post } from "@prisma/client";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData, useParams } from "@remix-run/react";
import { PostDisplay } from "~/components/post";
import { db } from "~/utils/db.server";
import { getUserId, requireUserId } from "~/utils/session.server";

export const meta: MetaFunction = ({
  data,
}: {
  data: LoaderData | undefined;
}) => {
  if (!data) {
    return { title: "No post", description: "No post found" };
  }
  return {
    title: `"${data.post.name}" post`,
    description: `Enjoy the "${data.post.name}" post and much more`,
  };
};

type LoaderData = { post: Post; isOwner: boolean };

export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = await getUserId(request);
  const post = await db.post.findUnique({
    where: { id: params.postId },
  });

  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  const data: LoaderData = { post, isOwner: userId === post.posterId };
  return json(data);
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") !== "delete") {
    throw new Response(`The _method ${form.get("_method")} is not supported`, {
      status: 400,
    });
  }
  const userId = await requireUserId(request);
  const post = await db.post.findUnique({
    where: { id: params.jokeId },
  });
  if (!post) {
    throw new Response("Can't delete what does not exist", {
      status: 404,
    });
  }
  if (post.posterId !== userId) {
    throw new Response("Pssh, nice try. That's not your post", {
      status: 401,
    });
  }
  await db.post.delete({ where: { id: params.jokeId } });
  return redirect("/jokes");
};

export default function PostRoute() {
  const data = useLoaderData<LoaderData>();

  return <PostDisplay post={data.post} isOwner={data.isOwner} />;
}

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();

  switch (caught.status) {
    case 400: {
      return <div className="">What you're trying to do is not allowed.</div>;
    }
    case 404: {
      return (
        <div className="">Couldn't find post with id {params.postId}.</div>
      );
    }
    case 401: {
      return (
        <div className="">Sorry, but {params.postId} is not your post.</div>
      );
    }
    default: {
      throw new Error(`Unhandled error: ${caught.status}`);
    }
  }
}

export function ErrorBoundary() {
  const { postId } = useParams();

  return (
    <div className="">{`There was an error loading post by the id ${postId}. Sorry.`}</div>
  );
}
