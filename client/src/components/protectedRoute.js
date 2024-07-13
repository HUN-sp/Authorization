import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../calls/users";
import { useNavigate } from "react-router-dom";
import { message, Layout, Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { HomeOutlined, LogoutOutlined, ProfileOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const getValidUser = async () => {
    try {
      const response = await GetCurrentUser();
      setUser(response.data);
      // Hide Loader
    } catch (error) {
      setUser(null);
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getValidUser();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    {
      label: <Link to="/">Home</Link>,
      icon: <HomeOutlined />,
    },
    user && {
      label: user.name,
      icon: <UserOutlined />,
      children: [
        {
          label: <Link to="/profile">My Profile</Link>,
          icon: <ProfileOutlined />,
        },
        {
          label: <span onClick={handleLogout}>Log Out</span>,
          icon: <LogoutOutlined />,
        },
      ],
    },
  ].filter(Boolean);

  return (
    <Layout>
      <Header
        className="d-flex justify-content-between"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <h3 className="demo-logo text-white m-0" style={{ color: "white" }}>
          Book My Show
        </h3>
        <Menu theme="dark" mode="horizontal" items={navItems} />
      </Header>
      <div style={{ padding: 24, minHeight: 380, background: "#fff" }}>
        {children}
      </div>
    </Layout>
  );
}

export default ProtectedRoute;