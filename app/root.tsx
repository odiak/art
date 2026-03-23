import { Global, css } from "@emotion/react";
import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

const globalStyle = css`
  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
  }

  body {
    font-family: sans-serif;
  }

  canvas,
  svg {
    display: block;
  }

  a {
    color: inherit;
  }
`;

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Art</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Global styles={globalStyle} />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <main style={{ padding: 8 }}>Loading...</main>;
}

export default function App() {
  return <Outlet />;
}
