import { createBrowserRouter, RouterProvider } from "react-router-dom";
import List from "../pages/list";
import Etf from "../pages/etf";

const router = createBrowserRouter([
  {
    path: "/",
    element: <List />,
  },
  {
    path: "/etf/:code",
    element: <Etf />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
