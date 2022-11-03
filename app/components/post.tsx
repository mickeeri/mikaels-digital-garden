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
      <p>Here's your post:</p>
      <p>{post.content}</p>
      <Link to=".">{post.name} Permalink</Link>
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
