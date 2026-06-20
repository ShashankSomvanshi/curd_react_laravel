import React from "react";

import NavDropdown from "react-bootstrap/NavDropdown";
import AboutImg from "../../assets/images/about-us.jpg";
import Header from "../common/Header";
import Footer from "../common/Footer";


function Home() {
  return (
    <>
      <Header/>
      <main>
        {/* Hero Section */}
        <section className="section-1">
          <div className="hero d-flex align-items-center">
            <div className="container-fluid">
              <div className="text-center">
                <span>Welcome Amazing Constructions</span>
                <h1>
                  Crafting Dream With <br /> precision and excellence.
                </h1>
                <p>
                  We excel at transforming vision into reality through
                  oustanding craftsmanship and precise <br />
                  attention to detail.With years of experience and a dedicate to
                  quality.
                </p>
                <div className="mt-4">
                  <a className="btn btn-primary">Contact Now</a>
                  <a className="btn btn-secondary ms-2">View Project</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* About Us Section */}
        <section className="section-2 py-5">
          <div className="container  py-5">
            <div className="row">
              <div className="col-md-6">
                <img src={AboutImg} alt="" className="w-100" />
              </div>
              <div className="col-md-6">
                <span>About Us</span>
                <h2>Crafting strucutre that last a lifetime</h2>
                <p>
                  Building enduring structures requires a comprehensive approach
                  that combines advanced materials, resilient design, routine
                  maintenance, and sustainable practices. By drawing on
                  historical insights and utilizing modern technology.
                </p>

                <p>
                  Designing structures that stand the test of time involves a
                  seamless blend of cutting-edge materials, durable design,
                  ongoing upkeep, and eco-friendly practices. By combining
                  lessons from the past with the power of modern technology.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer Section */}
      <Footer/>
    </>
  );
}

export default Home;
