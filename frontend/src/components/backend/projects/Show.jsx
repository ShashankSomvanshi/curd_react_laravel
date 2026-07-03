import React from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Sidebar from "../../common/Sidebar";
import { Link } from "react-router-dom";
import { apiUrl, token } from "../../common/Http";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Show = () => {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const res = await fetch(apiUrl + "projects", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
    });

    const result = await res.json();
    setProjects(result.data);
  };

  

  const deleteProject = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const res = await fetch(apiUrl + "projects/" + id, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });
      const result = await res.json();

      if (result.status == true) {
        const filterProjects = projects.filter((project) => project.id != id);
        setProjects(filterProjects);
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <Header />
      <main>
        <div className="container my-5">
          <div className="row">
            <div className="col-md-3">
              {/* sidebar */}
              <Sidebar />
            </div>
            <div className="col-md-9">
              <div className="card shadow border-0">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between">
                    <h5>Projects</h5>
                    <Link
                      to="/admin/project/create"
                      className="btn btn-primary"
                    >
                      Create
                    </Link>
                  </div>
                  <hr />
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Render project rows here */}
                      {projects &&
                        projects.map((project) => (
                          <tr key={`project-${project.id}`}>
                            <td>{project.id}</td>
                            <td>{project.title}</td>
                            <td>{project.slug}</td>
                            <td>{project.status == 1 ? "Active" : "Block"}</td>
                            <td>
                              <Link
                                to={`/admin/project/edit/${project.id}`}
                                className="btn btn-primary btn-sm"
                              >
                                Edit
                              </Link>
                              <Link
                                onClick={() => deleteProject(project.id)}
                                to={"#"}
                                className="btn btn-secondary btn-sm ms-2"
                              >
                                Delete
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Show;
