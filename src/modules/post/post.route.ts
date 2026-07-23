import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.admin, Role.user), postController.createPost);


router.get("/", postController.getAllPosts);

router.get(
    "/stats", 
    auth(Role.admin),
    postController.getPostsStats
);

router.get(
    "/my-posts",
    auth(Role.user, Role.admin),
    postController.getMyPosts
);

router.get("/:postId", postController.getPostById);

router.patch(
    "/:postId", 
    auth(Role.user, Role.admin), 
    postController.updatePost
);

router.delete(
    "/:postId", 
    auth(Role.user, Role.admin), 
    postController.deletePost
);


export const postRoute = router;
