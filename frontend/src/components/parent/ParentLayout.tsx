import { Outlet } from "react-router-dom";
import ParentSidebar from "./ParentSidebar";

const ParentLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <ParentSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ParentLayout;
