'use server'

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action"


export async function getNotifications(){
  try {

    const userId=await getDbUserId();

    if(!userId) return [];

    const nofitications=await prisma.notification.findMany({
     where:{
      userId
     },
     include:{
      creator:{
        select:{
          id:true,
          name:true,
          username:true,
          image:true
        }
      },
      post:{
        select:{
          id:true,
          content:true,
          image:true
        }
      },
      comment:{
        select:{
          id:true,
          content:true,
          createdAt:true
        }
      }
     },
     orderBy:{
      createdAt:'desc'
     }
    })

    return nofitications
    
  } catch (error) {
    console.log('Failed to fetch nofitications : ',error)
   throw new Error('Failed to fetch nofitications')
  }
}

export async function markNotificationsAsRead(notificationIds:string[]){
  try {
    await prisma.notification.updateMany({
      where:{
        id:{
          in:notificationIds
        }
      },
      data:{
        read:true
      }
    })

    return {
      success:true
    }
  } catch (error) {
    console.log('Failed to mark notification as read : ',error)
    return {
      success:false
    }
  }
}