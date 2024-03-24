/* eslint-disable react-refresh/only-export-components */

import { Link, Outlet } from "react-router-dom";

import DashIcon from "@/assets/DashIcon";
import LogOutIcon from "@/assets/LogOutIcon";
import MemberIcon from "@/assets/MemberIcon";
import RoleIcon from "@/assets/RoleIcon";
import StoryIcon from "@/assets/StoryIcon";
import { PermissionProtector } from "@/components/PermissionProtector";
import ErrorPage from "@/error-page";
import Permission from "@/types/permissions";
import CustomRouteElement from "@/types/routeElement";
import React from "react";
import LogsIcon from "@/assets/LogsIcon";
import TerminalIcon from "@/assets/TerminalIcon";
import EditionIcon from "@/assets/EditionIcon";

//lazy imports
const Login = React.lazy(() => import("@/pages/auth/Login"));
const NewStory = React.lazy(() => import("@/pages/story/NewStory"));
const YourStories = React.lazy(() => import("@/pages/story/YourStories"));
const PendingStories = React.lazy(() => import("@/pages/story/PendingStories"));
const ReadStory = React.lazy(() => import("@/pages/story/ReadStory"));
const PublishedStories = React.lazy(
  () => import("@/pages/story/PublishedStories"),
);
const ApprovedStories = React.lazy(
  () => import("@/pages/story/ApprovedStories"),
);
const AllRoles = React.lazy(() => import("@/pages/roles/AllRoles"));
const NewRole = React.lazy(() => import("@/pages/roles/NewRole"));
const AllMembers = React.lazy(() => import("@/pages/member/AllMembers"));
const Dashbboard = React.lazy(() => import("@/pages/dashboard"));
const AddMember = React.lazy(() => import("@/pages/member/AddMember"));
const NewEdition = React.lazy(() => import("@/pages/edition/NewEdition"));
const AllEditions = React.lazy(() => import("@/pages/edition/AllEditions"));
const Logs = React.lazy(() => import("@/pages/logs"));

/** This route map serves the routes as well as is used to
 * generate nav bar menu, so the links can never be broken */
const routeMap: CustomRouteElement[] = [
  {
    path: "dashboard/",
    element: <Dashbboard />,
    permission: [],
    label: "Dashboard",
    icon: <DashIcon />,
  },
  {
    path: "story/",
    element: (
      <>
        <Outlet />
      </>
    ),
    label: "Story",
    icon: <StoryIcon />,
    permission: [Permission.ReadBlog],
    children: [
      {
        path: "new-story/",
        element: <NewStory />,
        label: "New Story",
        permission: [Permission.CreateBlog],
      },
      {
        path: "your-stories/",
        element: <YourStories />,
        label: "Your Stories",
        permission: [Permission.ReadBlog],
      },
      {
        path: "pending-stories/",
        element: <PendingStories />,
        label: "Pending Stories",
        permission: [Permission.PublishBlog],
      },
      {
        path: ":blogId",
        element: <ReadStory />,
        label: "Read Story",
        permission: [Permission.ReadBlog, Permission.PublishBlog],
        hide: true,
      },
      {
        path: "approved-stories/",
        element: <ApprovedStories />,
        label: "Approved Stories",
        permission: [Permission.PublishBlog],
      },
      {
        path: "published-stories/",
        element: <PublishedStories />,
        label: "Published Stories",
        permission: [Permission.PublishBlog],
      },
    ],
  },
  {
    path: "edition/",
    label: "Edition",
    icon: <EditionIcon />, //todo:change icon
    permission: [],
    element: (
      <>
        <Outlet />
      </>
    ),
    children: [
      {
        path: "new-edition/",
        element: <NewEdition key="new-edition" />,
        label: "New Edition",
        permission: [Permission.CreateEdition],
      },
      {
        path: "update-edition/:id",
        element: <NewEdition key="update-edition" />,
        label: "Update Edition",
        permission: [Permission.UpdateEdition],
        hide: true,
      },
      {
        path: "all-editions/",
        element: <AllEditions />,
        label: "All Editions",
        permission: [],
      },
    ],
  },
  {
    path: "role/",
    label: "Role",
    icon: <RoleIcon />,
    permission: [Permission.ReadRole],
    element: (
      <>
        <Outlet />
      </>
    ),
    children: [
      {
        path: "all-roles/",
        element: <AllRoles />,
        permission: [Permission.ReadRole],
        label: "All Roles",
      },
      {
        path: "new-role/",
        element: <NewRole key="new-role" />,
        label: "New Role",
        permission: [Permission.CreateRole],
      },
      {
        path: "update-role/",
        element: <NewRole update_page={true} key="update-role" />,
        label: "Update Role",
        permission: [Permission.UpdateRole],
      },
    ],
  },
  {
    path: "member/",
    element: (
      <>
        <Outlet />
      </>
    ),
    permission: [],
    label: "Member",
    icon: <MemberIcon />,
    children: [
      {
        path: "all-members/",
        element: <AllMembers />,
        permission: [],
        label: "All Members",
      },
      {
        path: "add-member/",
        element: <AddMember />,
        permission: [Permission.CreateProfile],
        label: "Add Member",
      },
    ],
  },
  {
    path: "login?forcedLogout=true",
    element: <Login />,
    permission: [],
    label: "Logout",
    icon: <LogOutIcon />,
  },
  {
    path: "terminal/",
    element: (
      <h1 className="h-screen items-center justify-center flex">
        <Link to={"https://nginx.dtutimes.com/#/terminal"} target="_blank">
          Click here to redirect to terminal of DTU Times server
        </Link>
      </h1>
    ),
    permission: [Permission.AccessLogs],
    label: "Terminal",
    icon: <TerminalIcon />, // todo: change icon
  },
  {
    path: "logs/",
    element: <Logs />,
    icon: <LogsIcon />,
    permission: [Permission.AccessLogs],
    label: "Logs",
  },
];

const make_protected = (routes: CustomRouteElement[]) => {
  return routes.map((route) => {
    if (route.children) {
      route.children = make_protected(route.children);
    } else {
      route.element = (
        <PermissionProtector permission={route.permission}>
          {route.element}
        </PermissionProtector>
      );
    }
    return route;
  });
};

export const protectedRoutes = [
  {
    path: "/",
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: make_protected(routeMap),
  },
];
