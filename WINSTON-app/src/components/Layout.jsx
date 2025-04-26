import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";
import '../styles/layout.css';
import '../styles/footer.css'; 
import '../styles/navbar.css'; 




const Layout = () => {
    return (
        <>
          <Navbar />
          <main>
            <Outlet />
          </main>
          <Footer />
        </>
      );
    };



export default Layout;


