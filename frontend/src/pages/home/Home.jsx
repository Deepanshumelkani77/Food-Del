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
  const savedPosition = sessionStorage.getItem("scrollPosition");
  if (savedPosition) {
    window.scrollTo(0, parseInt(savedPosition, 10));
    sessionStorage.removeItem("scrollPosition"); // Remove after restoring
  }
}, []);



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
