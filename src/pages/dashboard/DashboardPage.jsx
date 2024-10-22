/* eslint-disabody {ble react-hooks/exhaustive-deps */
import { Navbar } from "../../components/Navbar";
import "./dashboardPage.css";
import { useUserDetails } from "../../shared/hooks";
import { Outlet } from "react-router-dom";

export const DashboardPage = () => {

  const { username } = useUserDetails();

  return (
    <div className="dashboard-container">
      {<Navbar user={username} />}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};
