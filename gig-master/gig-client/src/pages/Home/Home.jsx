import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import MyCarousel from "./MyCarosuel.jsx";
import "./Home.css";
import UserGrid from "./UserGrid.jsx";
import Login from "../login/login.jsx";
import { useSelector } from "react-redux";
import { selectAuthRoles } from "../../features/authSlice.js";

const Home = () => {
  const { pathname } = useLocation();
  const [users2, setUsers2] = useState();
  const [search, setSearch] = useState(null);
  const [category, setCategory] = useState(null);
  // console.log(users2);

  const roles = useSelector(selectAuthRoles);
  console.log(roles);

  const byCategory = (user, category) => {
    if (category) {
      return user?.category === category;
    } else return user;
  };
  const bySearch = (user, search) => {
    if (search) {
      return user?.name.toLowerCase().includes(search.toLowerCase());
    } else return user;
  };

  const filteredList = (users, category, search) => {
    return users
      ?.filter((user) => byCategory(user, category))
      ?.filter((user) => bySearch(user, search));
  };
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header showModal={showModal} setShowModal={setShowModal} />

      {showModal && <Login showModal={showModal} setShowModal={setShowModal} />}

      <div className="user-grid-main">
        <UserGrid />
      </div>
    </>
  );
};


export default Home;
