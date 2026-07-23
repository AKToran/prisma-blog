import { prisma } from "../../lib/prisma"
import { ICreatePostPayload } from "./post.interface"


const createPostIntoDB = async(payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId
    }
  })

  return result;
}

const getAllPostsFromDB = async( ) =>{
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit:{
          password: true,
          createdAt: true,
          updatedAt: true,
          activeStatus: true,
          id: true,
          role: true
        }
      },
      comments: true
    }
  });

  return posts;
}

const getPostsStats = async( ) =>{

}

const getMyPosts = async( ) =>{

}

const getPostById = async( ) =>{

}

const updatePostInDB = async( ) =>{

}

const deletePostFromDb = async( ) =>{

}


export const postService = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostsStats,
  getPostById,
  getMyPosts,
  updatePostInDB,
  deletePostFromDb
}