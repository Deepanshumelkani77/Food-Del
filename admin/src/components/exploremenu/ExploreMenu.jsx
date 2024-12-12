import React from 'react'
import "./ExploreMenu.css"
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {

  return (
    <div className='explore-menu' id='explore-menu'>


<div className="explore-menu-list">
    {menu_list.map((item,index)=>{
        return (      
          //jis menu item pa click kariga category m uski valuee jayagi        
            <div onClick={()=>{setCategory(prev=>prev===item.menu_name?"All":item.menu_name)}} key={index} className='explore-menu-list-item'>
                <img className={category===item.menu_name?"active":""} src={item.menu_image}></img>
                <p>{item.menu_name}</p>
                </div>
        )
    })}
</div>
<hr></hr>
      
    </div>
  )
}

export default ExploreMenu
