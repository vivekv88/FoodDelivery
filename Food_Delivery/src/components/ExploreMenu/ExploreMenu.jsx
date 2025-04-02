import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/frontend_assets/assets'

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore our Menu</h1>
        <p className='explore-menu-text'>Dive into a world of flavors with our diverse menu, featuring a delicious selection of dishes crafted with the finest ingredients. Whether you're craving something savory, sweet, or spicy, we have something to satisfy every craving. Explore now and let every meal be a delightful experience!</p>

        <div className='explore-menu-list'>
            {menu_list.map((item,index)=> {
                return (
                    <div onClick={() => setCategory(prev => prev===item.menu_name?"All":item.menu_name)} key={index} className="explore-menu-list-item">
                        <img className={category===item.menu_name?"active":"" } src={item.menu_image} alt="" />
                        <p>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
