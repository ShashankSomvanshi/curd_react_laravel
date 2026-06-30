import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await fetch("http://localhost:8000/api/authenticate", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.status == false) {
      toast.error(result.message);
    } else {
        const userInfo = {
            id:result.id,
            token:result.token
        }

        localStorage.setItem('userInfo',JSON.stringify(userInfo))
      navigate("/admin/dashboard");
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="container my-5 d-flex justify-content-center">
          <div className="login-form my-5">
            <div className="card shadow border-0">
              <div className="card-body p-4">
                <h4 className="mb-3">Login Here</h4>
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>

                    <input
                      {...register("email", {
                        required: "This feild is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      type="email"
                      id=""
                      className={`form-control ${errors.email && "is-invalid"}`}
                      placeholder="Enter Your Email"
                    />
                    {errors.email && (
                      <p className="invalid-feedback">
                        {errors.email?.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Password
                    </label>
                    <input
                      {...register("password", {
                        required: "This feild is required",
                      })}
                      type="password"
                      id=""
                      className={`form-control ${errors.password && "is-invalid"}`}
                      placeholder="Enter Your Password"
                    />
                    {errors.password && (
                      <p className="invalid-feedback">
                        {errors.password?.message}
                      </p>
                    )}
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
