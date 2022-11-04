import { Link, Form } from "@remix-run/react";
import type { Post } from "@prisma/client";

export function PostDisplay({
  post,
  isOwner,
  canDelete = true,
}: {
  post: Pick<Post, "content" | "name">;
  isOwner: boolean;
  canDelete?: boolean;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{post.name}</h1>
      <p className="my-2">{post.content}</p>
      <Link className="text-sky-500" to=".">
        {post.name} Permalink
      </Link>
      {isOwner ? (
        <Form method="post">
          <input type="hidden" name="_method" value="delete" />
          <button type="submit" className="button" disabled={!canDelete}>
            Delete
          </button>
        </Form>
      ) : null}
    </div>
  );
}
