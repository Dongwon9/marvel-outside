/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Feed = lazy(() => import("../pages/Feed"));
const PostList = lazy(() => import("../pages/PostList"));
const PostEditor = lazy(() => import("../pages/PostEditor"));
const PostView = lazy(() => import("../pages/PostView"));
const UserProfile = lazy(() => import("../pages/UserProfile"));
const Settings = lazy(() => import("../pages/Settings"));
const BoardList = lazy(() => import("../pages/BoardList"));
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
      {
        path: "/post/new",
        element: <ProtectedRoute element={<PostEditor />} />,
      },
      { path: "/post/:id", element: <PostView /> },
      {
        path: "/post/:id/edit",
        element: (
          <ProtectedRoute element={<PostEditor />} kickOnAuthFail={true} />
        ),
      },
      {
        path: "/user/:id",
        element: <ProtectedRoute element={<UserProfile />} />,
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute element={<Settings />} kickOnAuthFail={true} />
        ),
      },
      { path: "/boards", element: <BoardList /> },
      {
        path: "/board/:id",
        element: <BoardView />,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
