import React from 'react'
import Header from '../../Sections/Header/Header'
import { Outlet } from 'react-router-dom'

const LayoutWithOnlyHeader = () => {
  return (
    <>
      <Header/>
      <Outlet/>
    </>
  )
}

export default LayoutWithOnlyHeader
