import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import EmployeePage from './EmployeePage';
import Admin from './Admin';

const Home = () => {
  const { auth } = useContext(AuthContext);
  return (
    <div>
      {/* <EmployeePage type="category" /> */}
      {/* {auth?.user?.role === "employee" && <EmployeePage type={true} />} */}
      {auth?.user?.role === "employee" && <EmployeePage />}
      {auth?.user?.role === "admin" && <Admin />}
    </div>
  )
}

export default Home
