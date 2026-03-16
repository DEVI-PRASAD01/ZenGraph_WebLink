import { Outlet } from "react-router";
import { SideNav } from "../components/zen/SideNav";

export default function SessionLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F5F7FA",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <SideNav />

      {/* Main content area */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          minWidth: 0,
          background: "#FFFFFF",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
