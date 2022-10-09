import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./style.css";

let Home = React.lazy(() => import("./pages/Home"));

let router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

import("react-dom/client").then((ReactDOM) => {
  ReactDOM.createRoot(
    document.getElementById("app-mount") as HTMLElement
  ).render(
    <React.StrictMode>
      <Suspense
        fallback={
          <div>Sorry for the interruption.. we're trying to load content.</div>
        }>
        <RouterProvider router={router} />
      </Suspense>
    </React.StrictMode>
  );
});
