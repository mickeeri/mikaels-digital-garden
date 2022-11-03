import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => ({
  title: "Mikael's Digital Garden",
  description: "Welcome...",
});

export default function IndexRoute() {
  return (
    <div>
      <h1 className="">Hello Index Route</h1>

      <nav>
        <ul>
          <li>
            <Link prefetch="intent" to="posts">
              All posts
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
