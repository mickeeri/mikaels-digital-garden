import type { Post } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  postListItems: Array<Pick<Post, "id" | "name">>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const postListItems = await db.post.findMany({
    take: 10,
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
    <div className="mx-auto md:max-w-7xl">
      <nav className="pt-6 pb-4 flex justify-between">
        <Link to="/">
          <h1 className="text-2xl font-semibold">Mikael's Digital Garden 🪴</h1>
        </Link>

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
      </nav>

      <main className="mt-6">
        <div className="md:grid md:grid-cols-10 gap-16">
          <aside className="col-span-3">
            <ul>
              {data.postListItems.map((post) => (
                <li className="" key={post.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `p-2 block -ml-1 my-2 hover:text-slate-900 border-b border-slate-200 hover:border-slate-400 hover:scale-105 transition-all  ${
                        isActive
                          ? " border-slate-400 text-slate-900 border-b-2"
                          : undefined
                      }`
                    }
                    prefetch="intent"
                    to={post.id}
                  >
                    {post.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </aside>

          <div className="col-span-7">
            {data.user ? (
              <Link prefetch="intent" to="new">
                Add new post
              </Link>
            ) : null}

            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
