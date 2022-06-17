import React, { useState } from 'react';
import axios from 'axios'
import './Home.css'
function Home() {
   const [url,setUrl] = useState('')
   const [newUrl,setNewUrl] = useState('')
   const [shortId,setShortId] = useState('');
    const[updateShort,setUpdatedShort] = useState('')


    // get request input text
   const shortEventHandle = (event) =>{
    setShortId(event.target.value)
   }

//    post request input text
   const eventHandle = (event)=>{
    setUrl(event.target.value)
   }

//    when form is submited
   const handleSubmit =async (e)=>{
    e.preventDefault();
    
       await axios.post('http://localhost:4000/url/shorten',{
            longUrl:url
        }).then((r)=>{
            console.log(r.data.data.shortUrl)
            setUpdatedShort(r.data.data.shortUrl)
        }).catch((error)=>{
            console.log(error)
        })

   }

//    getting form data
   const getData= async (e) => {
    e.preventDefault();
  await axios.get(`http://localhost:4000/${shortId}`,{
    crossdomain:true
   }).then((r)=>{
    setNewUrl(r.data);
    console.log(r.data);
   })
   }

    return (
        <div>
            <div className='container'>
                <div className='brand-logo'></div>
                <div className='brand-title'>Shorter URL</div>
            <form onSubmit={handleSubmit}>

                <div className='inputs'>
                <label>
                    Enter Your Long URL over here
                </label>
               
                <input type="text" value={url} onChange = {eventHandle} placeholder="Enter the URL Here..." />
                </div>
                 <button type='submit'>Shorter the URL</button>
            {/* <p>
                {url}
            </p> */}

            
            </form>

            <div className='inputs'>
                <label>Please Enter your ShortId to fetch the actual URL</label>
            <input type="text" value = {shortId} onChange={shortEventHandle} placeholder="Please Enter your ShortId to fetch the url.."/> 
        
            </div>
            <button onClick={getData}>Get data</button>
            {/* {newUrl} */}

            <h2><a href={newUrl}>{newUrl}</a> </h2>
            {/* <h1>Short Url {updateShort}</h1> */}
           <h2> <a href={updateShort}>{updateShort}</a></h2>
        </div>
        </div>
    );
}

export default Home;