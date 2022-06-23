import React from 'react'
import bgImage from '../assests/bg.jpg'
import  Products  from './Products';
 const Home = () => {
  return (
    <div className='hero'>
        <div className="card bg-dark text-white">
  <img src={bgImage} className="card-img" alt="BackGround-photos" height="550px"/>
  <div className="card-img-overlay d-flex flex-column justify-content-center">
    <div className="container">
    <h5 className="card-title display-3 fw-bolder mb-0">NEW SEASON ARRIVALS</h5>
    <p className="card-text lead fs-2">CHECK OUT ALL THE TRENDS</p>
    
    </div>
    
  </div>
</div>
<Products/>
    </div>
  )
}

export default Home;