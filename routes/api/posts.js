const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../../models/Post");
const validatePostInput = require("../../validation/posts");
const Profile = require("../../models/Profiles");
const validateCommentInput = require("../../validation/comment");

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route   GET api/posts
// @desc    CGet posts
// @access  Public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc    Get posts by ID
// @access  Public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)

    .then((post) => res.json(post))
    .catch((err) =>
      res.status(400).json({ nopostfound: "No post found with that ID" })
    );
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      title: req.body.title,
      code: req.body.code,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    });
    newPost.save().then((post) => res.json(post));
  }
);

// @route   Delete api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id).then((post) => {
        //Check post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ unaut: "User not authorised" });
        }

        //Delete
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch((err) =>
            res.status(404).json({ postnotfound: "Post not found" })
          );
      });
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like a post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unike a post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id)
        .then((post) => {
          if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not liked this yet" });
          }

          // Get remove index
          const removeIndex = post.likes
            .map((item) => item.user.toString())
            .indexOf(req.user.id);

          //Splice
          post.likes.splice(removeIndex, 1);
          post.save().then((post) => res.json(post));
        })
        .catch((err) =>
          res.status(404).json({ postnotfound: "No post found" })
        );
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to a post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id).then((post) => {
      const newComment = {
        text: req.body.text,
        code: req.body.code,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
      };
      //Add to the comments array
      post.comments.unshift(newComment);
      post
        .save()
        .then((post) => res.json(post))
        .catch((err) =>
          res.status(404).json({ postnotfound: "Post not found" })
        );
    });
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a comment from a post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then((post) => {
        if (
          post.comments.filter(
            (comment) => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res.status(404).json({ commentnotfound: "Comment not found" });
        }
        //Get remove index
        const removeIndex = post.comments
          .map((item) => item._id.toString())
          .indexOf(req.params.comment_id);

        //Splice
        post.comments.splice(removeIndex, 1);
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: "Post not found" }));
  }
);
module.exports = router;
