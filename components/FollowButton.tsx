'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Loader2Icon } from 'lucide-react'
import toast from 'react-hot-toast'
import { toggleFollow } from '@/actions/user.action'

const FollowButton = ({userId}:{userId:string}) => {
  const [isLoading,setIsLoading]=useState<boolean>(false)


const handleFollow=async()=>{
setIsLoading(true)

try {

  await toggleFollow(userId)

  toast.success("User followed successfully")
  
} catch (error) {
  console.log('Error : ',error)
 toast.error("Error following user")
}finally{
  setIsLoading(false)
}
}

  return (
    <Button size={'sm'} variant={"secondary"} disabled={isLoading} className='w-28' onClick={handleFollow}>
  {isLoading?<Loader2Icon className='size-4 animate-spin'/>:"Follow"}
    </Button>
  )
}

export default FollowButton