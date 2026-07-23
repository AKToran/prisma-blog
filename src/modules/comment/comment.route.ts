import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middleware/auth";
import { commentController } from "./comment.controller";

const router = Router();

router.post( 
    "/",
    auth(Role.user, Role.admin),
    commentController.createComment
);

router.get(
    "/author/:authorId",
    commentController.getCommentByAuthorId
);

router.get(
    "/:commentId",
    commentController.getCommentByCommentId
);

router.patch(
    "/:commentId",
    auth(Role.user, Role.admin),
    commentController.updateComment
);

router.delete(
    "/:commentId",
    auth(Role.user, Role.admin),
    commentController.deleteComment
);

router.patch(
    "/:commentId/moderate",
    auth(Role.admin),
    commentController.moderateComment
);


export const commentRoute = router;