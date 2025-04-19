import React from 'react'
import Header from '../../Sections/Header/Head'
import { Outlet } from 'react-router-dom'

const LayoutWithHeaderAndFooter = () => {
  return (
    <>
      <Header/>
      <Outlet/>
      
    </>
  )
}

export default LayoutWithHeaderAndFooter
