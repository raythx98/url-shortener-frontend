import Header from "@/components/header";
import {Outlet} from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💗 by Ray — Connect with me on <a href="https://www.linkedin.com/in/raythx/" target="_blank" rel="noopener noreferrer" className="nav-link underline" >
            LinkedIn
          </a> 
      </div>
    </div>
  );
};

export default AppLayout;
