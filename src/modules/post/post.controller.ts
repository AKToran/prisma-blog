import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user!.id;
    const payload = req.body;
    const result = await postService.createPostIntoDB(payload, id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post Created SuccessFully.",
      data: result,
    });
  },
);

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPostsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All posts",
      data: result,
    });
  },
);

const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getMyPosts(req.user?.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My posts retrieved successfully.",
      data: result,
    });
  },
);

const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    if (!postId) {
      throw new Error("Post Id Required In Params");
    }

    const result = await postService.getPostById(postId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post retrieved successfully",
      data: result,
    });
  },
);

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    const postId = req.params.postId;

    if (!postId) {
      throw new Error("Post Id Required In Params");
    }

    const payload = req.body;

    const result = await postService.updatePostInDB(
      postId as string,
      payload,
      authorId as string,
      isAdmin,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post updated successfully",
      data: result,
    });
  },
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "admin";

    const postId = req.params.postId;
    if (!postId) {
      throw new Error("Post Id Required In Params.");
    }

    await postService.deletePostFromDb(
      postId as string,
      authorId as string,
      isAdmin,
    ); 

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post deleted successfully.",
      data: null,
    });
  },
);

export const postController = {
  createPost,
  getAllPosts,
  getPostsStats,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
};
