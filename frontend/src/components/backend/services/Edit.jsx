import React from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Sidebar from "../../common/Sidebar";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { apiUrl, token, fileUrl } from "../../common/Http";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import { useRef, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Edit = ({ placeholder }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [imageId, setImageId] = useState(null);
  const params = useParams();
  const [service, setService] = useState({});

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || "",
    }),
    [placeholder],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(apiUrl + "services/" + params.id, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`,
        },
      });

      const result = await res.json();
      setContent(result.data.content);
      setService(result.data);
      return {
        title: result.data.title,
        slug: result.data.slug,
        short_desc: result.data.short_desc,
        status: result.data.status,
      };
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const newData = { ...data, content: content, imageId: imageId };

    const res = await fetch(apiUrl + "services/" + params.id, {
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
      navigate("/admin/services");
    } else {
      toast.error(result.message);
    }
  };

  const handleFile = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("image", file);

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
      <main className="">
        <div className="container my-5">
          <div className="row">
            <div className="col-md-3">
              {/* sidebar */}
              <Sidebar />
            </div>
            <div className="col-md-9">
              {/* Dashboard */}
              <div className="card shadow border-0">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between">
                    <h5>Services / Edit</h5>
                    <Link to="/admin/services" className="btn btn-primary">
                      Back
                    </Link>
                  </div>
                  <hr />
                  <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Name <span className="error">*</span>
                      </label>
                      <input
                        {...register("title", {
                          required: "This feild is required",
                        })}
                        type="text"
                        placeholder="Title"
                        className={`form-control ${errors.title && "is-invalid"}`}
                      />
                      {errors.title && (
                        <p className="invalid-feedback">
                          {errors.title?.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="slug" className="form-label">
                        Slug <span className="error">*</span>
                      </label>
                      <input
                        {...register("slug", {
                          required: "This feild is required",
                        })}
                        type="text"
                        placeholder="Slug"
                        className={`form-control ${errors.slug && "is-invalid"}`}
                      />
                      {errors.slug && (
                        <p className="invalid-feedback">
                          {errors.slug?.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="short_desc" className="form-label">
                        Short Description
                      </label>
                      <textarea
                        {...register("short_desc")}
                        className="form-control"
                        placeholder="Short Description"
                        rows={4}
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
                        onChange={(newContent) => {}}
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
                      {service.image && (
                        <img
                          src={
                            fileUrl + "uploads/services/small/" + service.image
                          }
                          alt=""
                        />
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="" className="form-label">
                        Status
                      </label>
                      <select {...register("status")} className="form-control">
                        <option value="1">Active</option>
                        <option value="0">Block</option>
                      </select>
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
