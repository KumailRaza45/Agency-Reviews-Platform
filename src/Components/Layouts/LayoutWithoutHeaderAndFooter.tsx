import React from 'react'
import { Outlet } from 'react-router-dom'

const LayoutWithoutHeaderAndFooter = () => {
  return (
    <>
      <Outlet/>
    </>
  )
}

export default LayoutWithoutHeaderAndFooter
