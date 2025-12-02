import { Link, NavLink, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="layout-container">
        <Outlet />
    </div>
  );
};

export default MainLayout;