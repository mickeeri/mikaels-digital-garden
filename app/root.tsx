import type { MetaFunction } from "@remix-run/node";
import { LiveReload, Meta, Outlet, useCatch } from "@remix-run/react";
import React from "react";

export const meta: MetaFunction = () => {
  const description = `This is my own secret garden`;

  return {
    charset: "utf-8",
    description,
    keywords: "",
    "twitter:image": "",
    "twitter:card": "",
    "twitter:creator": "",
    "twitter:site": "",
    "twitter:title": "Mikael's Digital Garden",
    "twitter:description": description,
  };
};

const Document = ({
  children,
  title = "Mikael's Digital Garden",
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
      </head>
      <body>
        {children}
        <LiveReload />
      </body>
    </html>
  );
};

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div className="">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Uh-oh!">
      <div className="">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}
