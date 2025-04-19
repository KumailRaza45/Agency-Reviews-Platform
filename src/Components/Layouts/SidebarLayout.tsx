import Header from "../../Sections/Header/Header.js";
import Sidebar from "../../Sections/Sidebar/Sidebar";

function SidebarLayout({ children }) {
  return (
    <div>
      <Header isPortal />
      <div className="flex -mt-8" style={{ height: "calc(100vh - 101px)" }}>
        <div >
          <Sidebar />
        </div>
        <div className="flex-1 custom-scroll-bar" style={{ padding: '32px', overflowY: "scroll" }} >{children}</div>
      </div>
    </div>
  );
}

export default SidebarLayout;
