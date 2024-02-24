const express=require("express");
const { updateCommentCtrl, createCommentCtrl, fetchCommentCtrl, detailsCommentCtrl, deleteCommentCtrl } = require("../../controllers/comments/comments");
const commentRoutes=express.Router();
const protected=require("../../middlewares/protected")

// post/api/v1/comments
commentRoutes.post("/:id",protected,createCommentCtrl);
// Get/api/v1/comments
commentRoutes.get("/:id",fetchCommentCtrl);
// Get/api/v1/comments/:id
commentRoutes.get("/:id",detailsCommentCtrl);
// Delete/api/v1/comments/:id
commentRoutes.delete("/:id",protected,deleteCommentCtrl);
// put/api/v1/comments/:id
commentRoutes.put("/:id",protected,updateCommentCtrl);

module.exports=commentRoutes;