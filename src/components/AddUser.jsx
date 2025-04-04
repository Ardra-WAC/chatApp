import React, { useState } from "react";
import "../styles/AddUser.css";
import useAddUser from "../customHooks/useAddUser";

function AddUser() {

  const {  handleSearch, handleAdd, user} = useAddUser();

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user ? (
        <div className="user">
          <div className="detail">
            <img
              src="https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_female_user-512.png"
              alt=""
            />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      ):(
        "No matching results"
      )}
    </div>
  );
}

export default AddUser;
