import React from "react";
import { Routes, Route } from "react-router";

import Home from "../screens/Home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

    </Routes>
  );
};

export default AppRoutes;