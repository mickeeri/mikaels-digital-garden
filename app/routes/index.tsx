import { Link } from "@remix-run/react";

export default function IndexRoute() {
  return (
    <div>
      <h1>Hello Index Route</h1>

      <nav>
        <ul>
          <li>
            <Link to="posts">All posts</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
