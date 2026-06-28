import React from 'react'

const Hero = ({preHeading,heading,text}) => {
  return (
    <section className="section-1">
          <div className="hero d-flex align-items-center">
            <div className="container">
              <div className="text-left">
                <span>{preHeading}</span>
                <h1 dangerouslySetInnerHTML={{__html:heading}}></h1>
                <p dangerouslySetInnerHTML={{ __html:text }}></p>
              </div>
            </div>
          </div>
        </section>
  )
}

export default Hero