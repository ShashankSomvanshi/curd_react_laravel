import React, { useEffect, useState } from 'react'
import Header from "../../common/Header";
import Footer from '../../common/Footer';
import Sidebar from '../../common/Sidebar';
import { Link } from 'react-router-dom';
import { apiUrl, token } from '../../common/Http';

const Show = () => {
    const [articles,setArticles] = useState([]);
    
    const fetchArticles =  async () => {
        const res = await fetch(apiUrl + 'articles',{
            method:"GET",
            headers:{
                'Content-type':'application/json',
                'Accept':'application/json',
                'Authorization':`Bearer ${token()}`
            }
        })

        const result = await res.json();
        setArticles(result.data);
    }

    useEffect(()=>{
        fetchArticles()
    },[]);

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
                    <h5>Articles</h5>
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
                      {articles &&
                        articles.map((article) => (
                          <tr key={`articles-${article.id}`}>
                            <td>{article.id}</td>
                            <td>{article.title}</td>
                            <td>{article.slug}</td>
                            <td>{article.status == 1 ? "Active" : "Block"}</td>
                            <td>
                              <Link
                                to={`/admin/project/edit/${article.id}`}
                                className="btn btn-primary btn-sm"
                              >
                                Edit
                              </Link>
                              <Link
                                onClick={() => deleteProject(article.id)}
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
  )
}

export default Show