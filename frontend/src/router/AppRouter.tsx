import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Feed = lazy(() => import("../pages/Feed"));
const PostList = lazy(() => import("../pages/PostList"));
const PostNew = lazy(() => import("../pages/PostNew"));
const PostView = lazy(() => import("../pages/PostView"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const Settings = lazy(() => import("../pages/Settings"));
const BoardView = lazy(() => import("../pages/BoardView"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/feed", element: <Feed /> },
      { path: "/post", element: <PostList /> },
      { path: "/post/new", element: <PostNew /> },
      { path: "/post/:id", element: <PostView /> },
      { path: "/user/:id", element: <UserProfile /> },
      { path: "/settings", element: <Settings /> },
      { path: "/board/:id", element: <BoardView /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
