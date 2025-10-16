import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from '@/actions/profile.action'
import { Metadata } from 'next'
import { notFound } from 'next/navigation';
import React from 'react'
import ProfilePageClient from './ProfilePageClient';

interface PageProps {
  params: {
    username: string
  }
}

export const generateMetadata=async({params}:PageProps):Promise<Metadata>=>{
  const username=await params.username
  const user=await getProfileByUsername(username);

  
  return {
    title:`${user?.name ?? user?.username}`
  }
}

const ProfilePage =async ({params}:PageProps) => {
    const user=await getProfileByUsername(params.username);
  if(!user) notFound()

    const [posts,likedPosts,isCurrentUserFollowing]=await Promise.all([
      getUserPosts(user.id),
      getUserLikedPosts(user.id),
      isFollowing(user.id)
    ])
  return (
   <ProfilePageClient
   user={user}
   posts={posts}
   likedPosts={likedPosts}
   isFollowing={isCurrentUserFollowing}
   />
  )
}

export default ProfilePage