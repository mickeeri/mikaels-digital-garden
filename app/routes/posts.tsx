import type { Post } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  postListItems: Array<Pick<Post, "id" | "name">>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const postListItems = await db.post.findMany({
    take: 5,
    select: { id: true, name: true },
    orderBy: { createdAt: "desc" },
  });

  const user = await getUser(request);

  const data: LoaderData = { postListItems, user };

  return json(data);
};

export default function PostsRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <Link to="/">Home</Link>

      {data.user ? (
        <div className="">
          <span>{`Hi ${data.user.username}`}</span>
          <Form action="/logout" method="post">
            <button type="submit" className="button">
              Logout
            </button>
          </Form>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}

      <h1>Posts</h1>

      <main>
        <p>List of posts:</p>
        <ul>
          {data.postListItems.map((post) => (
            <li key={post.id}>
              <Link to={post.id}>{post.name}</Link>
            </li>
          ))}
        </ul>

        <Link to="new">Add new post</Link>

        <Outlet />
      </main>
    </div>
  );
}
