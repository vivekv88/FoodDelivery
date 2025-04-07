import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = () => {

  const url = "http://localhost:3000"
  const [list, setList] = useState([])

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`)
    console.log(response.data);

    if (response.data.success) {
      setList(response.data.data)
    }
    else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='list add fex-col'>
      <p>All Food Items</p>
      <div className="list-items">
        <div className="list-item-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item,index) => {
          return (
            <div key={index} className="list-item-format">
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p className='cursor'>X</p>
            </div>
          )
        })}

      </div>
    </div>
  )
}

export default List

