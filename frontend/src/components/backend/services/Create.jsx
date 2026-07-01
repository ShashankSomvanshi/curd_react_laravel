import React, { useMemo, useState } from 'react'
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import Sidebar from '../../common/Sidebar'
import { Link, useNavigate}  from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUrl, token } from '../../common/Http'
import { toast } from 'react-toastify'
import JoditEditor from 'jodit-react';
import { useRef } from 'react'

const Create = ({placeholder}) => {

  const editor = useRef(null);
  const [content,setContent] = useState();

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: placeholder || 'Content'
    }),
    [placeholder]
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()  

  const navigate = useNavigate();
  


  const onSubmit = async (data) =>{

    const newData = {...data,"content":content}

    const res = await fetch(apiUrl + 'services',{
      method:'POST',
      headers:{
        'Content-type':'application/json',
        'Accept':'application/json',
        'Authorization': `Bearer ${token()}`
      },
      body:JSON.stringify(newData)
    });

    const result = await res.json();

    if(result.status == true){
      toast.success(result.message);
        navigate('/admin/services');
    }else{
        toast.error(result.message);
    }
  }


  return (
    <>
      <Header />
      <main className="">
        <div className="container my-5">
          <div className="row">
            <div className="col-md-3">
              {/* sidebar */}
              <Sidebar/>
            </div>
            <div className="col-md-9">
              {/* Dashboard */}
              <div className="card shadow border-0">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between">
                    <h5>Services/Create</h5>
                    <Link to='/admin/services' className='btn btn-primary'>Back</Link>
                  </div>
                  <hr />
                  <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <label htmlFor="name" className='form-label'>Name <span className='error'>*</span></label>
                      <input
                      {
                        ...register('title',{
                          required:'This feild is required'
                        })
                      } 
                       type="text" placeholder='Title' className={`form-control ${errors.title && 'is-invalid'}`} />
                       {
                         errors.title && <p className='invalid-feedback'>{errors.title?.message}</p>
                       }
                    </div>

                    <div className="mb-3">
                      <label htmlFor="slug"  className='form-label'>Slug <span className="error">*</span></label>
                      <input
                      {
                        ...register('slug',{
                          required:'This feild is required'
                        })
                      }
                       type="text" placeholder='Slug' className={`form-control ${errors.slug && 'is-invalid'}`} />
                       {
                         errors.slug && <p className='invalid-feedback'>{errors.slug?.message}</p>
                       }
                    </div>

                    <div className="mb-3">
                      <label htmlFor="short_desc" className='form-label'>Short Description</label>
                      <textarea
                      {
                        ...register('short_desc')
                      }
                       className='form-control' placeholder='Short Description' rows={4}></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="content" className='form-label'>Content</label>
                      <JoditEditor
                          ref={editor}
                          value={content}
                          config={config}
                          tabIndex={1} // tabIndex of textarea
                          onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                          onChange={newContent => {}}
                        />
                      </div>

                    <div className="mb-3">
                      <label htmlFor="" className='form-label'>Status</label>
                      <select
                      {
                        ...register('status')
                      }
                       className='form-control'>
                        <option value="1">Active</option>
                        <option value="0">Block</option>
                      </select>
                    </div>

                    <button className="btn btn-primary">Submit</button>

                  </form>
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

export default Create