import FingerPrint from "./screens/FingerPrint";
import Bluetooth from "./screens/Bluetooth";
import Wire from "./screens/Wire";
import Settings from "./screens/Settings";

export default [
  {
    component: FingerPrint,
    path: "/",
    exact: true,
  },
  {
    component: Bluetooth,
    path: "/bluetooth",
    exact: true,
  },
  {
    component: Wire,
    path: "/wired",
    exact: true,
  },
  {
    component: Settings,
    path: "/settings",
    exact: true,
  },
];
