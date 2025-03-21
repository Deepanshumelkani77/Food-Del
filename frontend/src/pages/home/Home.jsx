import React from 'react'
import './Home.css'
import Header from '../../components/header/Header'
import ExploreMenu from '../../components/exploreMenu/ExploreMenu'
import {useState,useEffect} from "react"
import FoodDisplay from '../../components/fooddisplay/FoodDisplay'
import AppDownload from '../../components/footer/appdownload/AppDownload'

const Home = () => {

  const[category ,setCategory]=useState("All");

//for scroll
useEffect(() => {
  window.scrollTo(0, 0);
   
});




  return (
    <div>
      
<Header/>
<ExploreMenu category={category} setCategory={setCategory}/>
<FoodDisplay  category={category}/>
<AppDownload/>

    </div>
  )
}

export default Home
