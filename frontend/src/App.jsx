import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import EmployeePage from "./pages/EmployeePage"; // Import EmployeePage
import MobileBottomNav from "./components/MobileBottomNav";
import EmployeeRequestPage from "./pages/EmployeeRequestPage";
import MyIssues from "./pages/MyIssues";
import Account from "./pages/Account";
import RequestOpenPage from "./pages/RequestOpenPage";
import MobileSearchPage from "./pages/MobileSearchPage";
import UserManagement from "./pages/UserManagement";
import UserDetails from "./pages/UserDetails";

function App() {
  const { auth } = useContext(AuthContext);
  const isLoggedIn = !!auth.user;
  const location = useLocation(); // Get the current location


  return (
    <>
    <div className="relative h-screen w-screen">
      <div className="h-full w-full overflow-auto">
      {location.pathname !== "/dashboard/search" && <Navbar />}
      <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to={`/user/${auth.user.username}`} /> : <Navigate to="/sign-in" />} />
          {/* <Route path="/home" element={<Home type="category" />} />  */}
          <Route path="/sign-in" element={<Auth type="sign-in" />} />
          <Route path="/log-in" element={<Auth type="log-in" />} />
          <Route path="/details" element={<Auth type="details" />} />
          <Route path="/user/:user" element={<Home />} />
          
          
          <Route path="/user/:user/request" element={<EmployeeRequestPage type={true} />} />
          <Route path="/user/:user/request/:categoryName/:CategoryId" element={<EmployeeRequestPage type={false} />} /> 


          <Route path="/request/:id/:title/ticket/:ticketId" element={<RequestOpenPage />} /> 
          <Route path="/dashboard/search" element={<MobileSearchPage />} /> 


          <Route path="user/:user/my-issues" element={<MyIssues />} />
          <Route path="user/:userId/:userName/details" element={<UserDetails />} />

          <Route path="user/:user/settings/edit-profile" element={<Account />} />
          <Route path="user/:user/settings/edit-category" element={<CategoryPage />} />
          <Route path="user/:user/manage" element={<UserManagement />} /> 
        </Routes>
      </div>
      {isLoggedIn && <MobileBottomNav />}
    </div>
    </>
  );
}

export default App;
