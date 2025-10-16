'use client'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { AvatarImage } from './ui/avatar'

const SidebarImage = () => {
  const {user}=useUser()
  return (
     <AvatarImage src={user?.imageUrl || "/avatar.png"} />
  )
}

export default SidebarImage