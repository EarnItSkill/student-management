import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { isSideMenu } = useAppContext();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Container */}
      <div className="drawer lg:drawer-open">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isSidebarOpen}
          onChange={toggleSidebar}
        />

        {/* Main Content */}
        <div className="drawer-content">
          {/* Mobile Menu Button */}
          <div className="lg:hidden p-4">
            <label
              htmlFor="my-drawer"
              className="btn btn-primary drawer-button"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
              <span className="ml-2">Menu</span>
            </label>
          </div>

          {/* Page Content */}
          {isSideMenu && <div className="p-4 lg:p-8">{children}</div>}
          {!isSideMenu && (
            <div className="p-4 lg:p-8">
              <Outlet />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
