
import Sidebar from "./Sidebar";
import "./Sidebar.css";

export default function VetLayout({ children }) {
  return (
    <div className="vet-layout">
      <Sidebar />
      <main className="vet-layout__content">{children}</main>
    </div>
  );
}
