import Home from "../pages/Home";
import Login from "../pages/Login";
import RoutesList from "../pages/RoutesList";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Archive from "../pages/Archive";
import NoMatch from "../pages/NoMatch";
import Trips from "../pages/Trips";
import MyTrips from "../pages/MyTrips";
import NewTrip from "../pages/NewTrip";
import ViewTrip from "../pages/ViewTrip";
import NewRoute from "../pages/NewRoute";

const routes = [
  {
    path: "/",
    exact: true,
    auth: true, 
    component: RoutesList,
    fallback: Home
  },
  {
    path: "/login",
    exact: true,
    auth: false,
    component: Login
  },
  {
    path: "/register",
    exact: true,
    auth: false,
    component: Register
  },
  {
    path: "/forgot-password",
    exact: true,
    auth: false,
    component: ForgotPassword
  },
  {
    path: "/reset-password",
    exact: true,
    auth: false,
    component: ResetPassword
  },
  {
    path: "/archive",
    exact: true,
    auth: true,
    component: Archive
  },
  {
    path: "/trips",
    exact: true,
    auth: true,
    component: Trips,
    fallback: Home
  },
  {
    path: "/my-trips",
    exact: true,
    auth: true,
    component: MyTrips,
    fallback: Home
  },
  {
    path: "/my-trips/new",
    exact: true,
    auth: true,
    component: NewTrip,
    fallback: Home
  },
  {
    path: "/user-trip",
    exact: true,
    auth: true,
    component: ViewTrip,
    fallback: Home,
  },
  {
    path: "/route/new",
    exact: true,
    auth: true,
    component: NewRoute,
    fallback: Home,
  },
  {
    path: "",
    exact: false,
    auth: false,
    component: NoMatch
  }
];

export default routes;
