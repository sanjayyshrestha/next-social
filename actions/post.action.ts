"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, imageUrl: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    const post = await prisma.post.create({
      data: {
        content,
        image: imageUrl,
        authorId: userId,
      },
    });

    revalidatePath("/");

    return {
      success: true,
      post,
    };
  } catch (error) {
    console.log("Failed to create post : ", error);
    return {
      success: false,
      error: "Failed to create post",
    };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.log("Error in fetching post : ", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return null;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      //unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),

        ...(post?.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  creatorId: userId, //person who liked
                  userId: post.authorId, //notification reciever
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    console.log("Failed to toggle like : ", error);
    return {
      success: false,
      error: "Failed to toggle like",
    };
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;
    if (!content) throw new Error("Content is required");
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) throw new Error("Post not found");

    const [comment] = await prisma.$transaction(async (tx) => {
      const newComment = await prisma.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
        },
      });

      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            creatorId: userId,
            userId: post.authorId,
            postId,
            commentId: newComment.id,
          },
        });
      }

      return [newComment];
    });

    revalidatePath("/");

    return {
      success: true,
      comment,
    };
  } catch (error) {
    console.log("Error in creating comment : ", error);
    return {
      success: false,
      error: "Error in creating comment",
    };
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId)
      throw new Error("Unauthorized- Only post author can delete the post");

    await prisma.post.delete({
      where:{id:postId}
    })

    revalidatePath('/')
    return {
      success:true
    }
  } catch (error) {
    console.log("Error in deleting post : ", error);
    return {
      success: false,
      error: "Error in deleting post",
    };
  }
}


export async function deleteComment(commentId:string){

 try {
   const userId=await getDbUserId();
  if(!userId) return;
  const comment=await prisma.comment.findUnique({
    where:{id:commentId}
  })
  if(!comment) throw new Error("Comment not found")
    if(comment.authorId!==userId) throw new Error("Unauthorized- only commented author can delete the comment")
      
      await prisma.comment.delete({
    where:{id:commentId}
  })
  
  revalidatePath('/')
  return{
    success:true
  }
  
 } catch (error) {
  console.log('Failed to delete comment ',error)
  return{
    success:false,
    error:"Failed to delete comment"
  }
 }
}