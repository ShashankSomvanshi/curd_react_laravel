import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Sidebar from "../../common/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import JoditEditor from "jodit-react";
import { apiUrl, token } from "../../common/Http";
import { toast } from "react-toastify";
import { fileUrl } from "../../common/Http";

const Edit = ({ placeholder }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [project, setProject] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [imageId, setImageId] = useState(null);

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "Content",
    }),
    [placeholder],
  );

  const params = useParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(apiUrl + "projects/" + params.id, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      const result = await res.json();
      setContent(result.data.content);
      setProject(result.data);
      return {
        title: result.data.title,
        slug: result.data.slug,
        short_desc: result.data.short_desc,
        status: result.data.status,
        content: result.data.content,
        location: result.data.location,
        construction_site: result.data.construction_site,
        sector: result.data.sector,
      };
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const newData = { ...data, content: content, imageId: imageId };

    const res = await fetch(apiUrl + "projects/" + params.id, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: JSON.stringify(newData),
    });

    const result = await res.json();

    if (result.status == true) {
      toast.success(result.message);
      navigate("/admin/projects");
    } else {
      toast.error(result.message);
    }
  };

  const handleFile = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("image", file);
    setIsDisabled(true);

    const res = await fetch(apiUrl + "temp-images", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token()}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        setIsDisabled(false);
        if (result.status == false) {
          toast.error(result.errors.image[0]);
        } else {
          setImageId(result.data.id);
        }
      });
  };

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
                    <h5>Projects / Edit</h5>
                    <Link to="/admin/projects" className="btn btn-primary">
                      Back
                    </Link>
                  </div>
                  <hr />
                  <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Name <span className="error">*</span>
                      </label>
                      <input
                        {...register("title", {
                          required: "This feild is required",
                        })}
                        type="text"
                        className={`form-control ${errors.title && "is-invalid"}`}
                        placeholder="Title"
                      />
                      {errors.title && (
                        <p className="invalid-feedback">
                          {errors.title?.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Slug <span className="error">*</span>
                      </label>
                      <input
                        {...register("slug", {
                          required: "This feild is required",
                        })}
                        type="text"
                        className={`form-control ${errors.slug && "is-invalid"}`}
                        placeholder="Slug"
                      />
                      {errors.slug && (
                        <p className="invalid-feedback">
                          {errors.slug?.message}
                        </p>
                      )}
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Location
                          </label>
                          <input
                            {...register("location")}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Construction Type
                          </label>
                          <select
                            {...register("construction_site")}
                            className="form-control"
                          >
                            <option value="">Construction Type</option>
                            <option value="Residentail Construction">
                              Residentail Construction
                            </option>
                            <option value="Commercail Construction">
                              Commercail Construction
                            </option>
                            <option value="Industrail Construction<">
                              Industrail Construction
                            </option>
                            <option value="Infrastructure Construction">
                              Infrastructure Construction
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="sector" className="form-label">
                            Sector
                          </label>
                          <select
                            {...register("sector")}
                            id="sector"
                            className="form-control"
                          >
                            <option value="healthcare">HealthCare</option>
                            <option value="education">Education</option>
                            <option value="corporate">Corporate</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Status
                          </label>
                          <select
                            {...register("status")}
                            className="form-control"
                          >
                            <option value="1">Active</option>
                            <option value="0">Block</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Short Description
                      </label>
                      <textarea
                        {...register("short_desc")}
                        className="form-control"
                        rows={5}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">
                        Content
                      </label>
                      <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        tabIndex={1} // tabIndex of textarea
                        onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                        onChange={(newContent) => setContent(newContent)}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Image
                      </label>
                      <input
                        {...register("image")}
                        type="file"
                        onChange={handleFile}
                        className="form-control"
                      />
                    </div>

                    <div className="pb-3">
                      {project.image && (
                        <img
                          src={
                            fileUrl + "uploads/projects/small/" + project.image
                          }
                          alt=""
                        />
                      )}
                    </div>

                    <button disabled={isDisabled} className="btn btn-primary">
                      Update
                    </button>
                  </form>
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

export default Edit;
