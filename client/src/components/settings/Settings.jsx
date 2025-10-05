import {
  Bell,
  Lock,
  Palette,
  Save,
  Settings as SettingsIcon,
  User,
} from "lucide-react";
import { useState } from "react";
import { useAppContext } from "../../context/useAppContext";

const Settings = () => {
  const { currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState("light");

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-7 h-7 text-primary" />
          Settings
        </h2>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6 bg-base-100 p-2 shadow-lg">
        <a
          role="tab"
          className={`tab gap-2 ${activeTab === "profile" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <User className="w-4 h-4" />
          Profile
        </a>
        <a
          role="tab"
          className={`tab gap-2 ${
            activeTab === "security" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("security")}
        >
          <Lock className="w-4 h-4" />
          Security
        </a>
        <a
          role="tab"
          className={`tab gap-2 ${
            activeTab === "notifications" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          <Bell className="w-4 h-4" />
          Notifications
        </a>
        <a
          role="tab"
          className={`tab gap-2 ${
            activeTab === "appearance" ? "tab-active" : ""
          }`}
          onClick={() => setActiveTab("appearance")}
        >
          <Palette className="w-4 h-4" />
          Appearance
        </a>
      </div>

      {/* Tab Content */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Profile Settings</h3>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                <input
                  type="text"
                  defaultValue={currentUser?.name}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  defaultValue={currentUser?.email}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Phone</span>
                </label>
                <input
                  type="tel"
                  placeholder="01700000000"
                  className="input input-bordered"
                />
              </div>

              <button className="btn btn-primary gap-2">
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Security Settings</h3>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Current Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">New Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Confirm New Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="input input-bordered"
                />
              </div>

              <button className="btn btn-primary gap-2">
                <Lock className="w-5 h-5" />
                Update Password
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Notification Preferences</h3>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-semibold">
                    Email Notifications
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    defaultChecked
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-semibold">
                    SMS Notifications
                  </span>
                  <input type="checkbox" className="toggle toggle-primary" />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-semibold">
                    Payment Reminders
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    defaultChecked
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-semibold">
                    Course Updates
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    defaultChecked
                  />
                </label>
              </div>

              <button className="btn btn-primary gap-2">
                <Save className="w-5 h-5" />
                Save Preferences
              </button>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Appearance Settings</h3>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Choose Theme</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    "light",
                    "dark",
                    "cupcake",
                    "cyberpunk",
                    "retro",
                    "valentine",
                    "sunset",
                    "business",
                  ].map((themeName) => (
                    <button
                      key={themeName}
                      onClick={() => handleThemeChange(themeName)}
                      className={`btn ${
                        theme === themeName ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divider"></div>

              <div className="alert alert-info">
                <Palette className="w-6 h-6" />
                <span>Theme changes will be applied immediately</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
