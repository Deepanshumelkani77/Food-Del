import React ,{useState} from 'react'
import "./List.css"
import ExploreMenu from "../../components/exploremenu/ExploreMenu.jsx"
import FoodDisplay from "../../components/fooddisplay/FoodDisplay.jsx"
const List = () => {

  const[category ,setCategory]=useState("All");

  return (
    <div className='list'>
      
      <div className="list-content">
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      </div>
   

    </div>
  )
}

export default List
