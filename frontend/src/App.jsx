import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Home from "./components/frontend/Home";
import About from "./components/frontend/About";
import "./assets/css/style.scss";
import Services from "./components/frontend/Services";
import Projects from "./components/frontend/Projects";
import Blogs from "./components/frontend/Blogs";
import ContactUs from "./components/frontend/ContactUs";
import Login from "./components/backend/Login";
import { ToastContainer, toast } from "react-toastify";
import Dashboard from "./components/backend/Dashboard";
import RequireAuth from "./components/common/RequireAuth";
import {default as ShowServices } from "./components/backend/services/Show";
import {default as CreateService }from "./components/backend/services/Create";
import {default as EditService } from "./components/backend/services/Edit";
import {default as ShowProjects } from "./components/backend/projects/Show";
import {default as CreateProject } from "./components/backend/projects/Create";
import {default as EditProject } from "./components/backend/projects/Edit";
import {default as ShowArticles } from "./components/backend/articles/Show";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="projects" element={<Projects />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>}/>
          <Route path="/admin/services" element={<RequireAuth><ShowServices /></RequireAuth>}/>
          <Route path="/admin/service/create" element={<RequireAuth><CreateService /></RequireAuth>}/>
          <Route path="/admin/service/edit/:id" element={<RequireAuth><EditService /></RequireAuth>}/>
          <Route path="/admin/projects" element={<RequireAuth><ShowProjects/></RequireAuth>} />
          <Route path="/admin/project/create" element={<RequireAuth><CreateProject /></RequireAuth>}/>
          <Route path="/admin/project/edit/:id" element={<RequireAuth><EditProject /></RequireAuth>}/>
          <Route path="/admin/articles" element={<RequireAuth><ShowArticles/></RequireAuth>} />

          
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
