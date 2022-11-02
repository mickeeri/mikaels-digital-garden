import type { Post } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

type LoaderData = {
  postListItems: Array<Pick<Post, "id" | "name">>;
};

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    postListItems: await db.post.findMany({
      take: 5,
      select: { id: true, name: true },
      orderBy: { createdAt: "desc" },
    }),
  };

  return json(data);
};

export default function PostsRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <Link to="/">Home</Link>

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
