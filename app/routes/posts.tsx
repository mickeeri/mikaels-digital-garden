import { Outlet } from "@remix-run/react";

export default function PostsRoute() {
  return (
    <div>
      <h1>POSTS</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
