"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

//explore webhooks
export const syncUser = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) return;

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (existingUser) return existingUser;

  const dbUser = await prisma.user.create({
    data: {
      clerkId: userId,
      name: user.firstName || user.lastName,
      username:
        user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
      email: user.emailAddresses[0].emailAddress,
      image: user.imageUrl,
    },
  });

  return dbUser;
};

export const getUserByClerkId = async (clerkId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
  return user;
};

export const getDbUserId = async () => {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");

  return user.id;
};

export const getRandomUsers = async () => {
  try {
    const userId = await getDbUserId();
   
    if(!userId) return []
   const randomUsers= await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          { NOT: { followers: { some: { followerId: userId } } } },
        ],
      },
      select:{
        id:true,
        name:true,
        username:true,
        image:true,
        _count:{
          select:{
            followers:true
          }
        }
      },
      take:3
    });

    return randomUsers;
  } catch (error) {
    console.log('Error fetching random errors : ',error)
    return []
  }
};


export const toggleFollow=async (targetUserId:string)=>{
 
try {
  const userId=await getDbUserId();
  if(!userId) return
  if(userId===targetUserId) throw new Error("You cannot follow yourself")


    const existingFollow=await prisma.follows.findUnique({
      where:{
        followerId_followingId:{
          followerId:userId,
          followingId:targetUserId
        }
      }
    })

    if(existingFollow) {
     await prisma.follows.delete({
      where:{
        followerId_followingId:{
           followerId:userId,
           followingId:targetUserId
        }
      }
     })
    }else{
     
      await prisma.$transaction([
        prisma.follows.create({
          data:{
            followerId:userId,
            followingId:targetUserId
          }
        }),

        prisma.notification.create({
          data:{
            type:'FOLLOW',
            userId:targetUserId,//user being followed
            creatorId:userId //user following
          }
        })
      ])
    }
  
    revalidatePath('/')
    return {
      success:true
    }

} catch (error) {
  console.log('Error in following',error)
  return {
    success:false,
    error:"Error toggling follow"
  }
}

}