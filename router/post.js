const router = require("express").Router();
const Post = require("../Modals/Post");
const { verifyToken } = require("./verifytoken");

//create post

router.post("/user/post", verifyToken, async (req, res) => {
  try {
    let { title, image, video } = req.body;
    let newpost = new Post({
      title,
      image,
      video,
      user: req.user.id,
    });
    console.log(newpost);
    const post = await newpost.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
});

//upload post by one user

router.get("/get/post", verifyToken, async (req, res) => {
  try {
    const mypost = await Post.find({ user: req.user.id });
    if (!mypost) {
      return res.status(400).json("you dont have any post");
    }
    res.status(200).json(mypost);
  } catch (error) {
    res.status(500).json("internal server error");
  }
});

//update user post

router.put("/update/post/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    if (!post) {
      return res.status(400).json("Post doesnot exist of given id");
    }
    post = await Post.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    let updatepost = await post.save();
    console.log(updatepost);
    res.status(200).json(updatepost);
  } catch (error) {
    return res.status(500).json("internal server error1");
  }
});
//likes 

router.put("/:id/like",verifyToken,async(req,res)=>{
    try {
      
      const post=await Post.findById(req.params.id);
      if(!post.like.includes(req.body.user)){
        await post.updateOne({$push:{like:req.body.user}})
        return res.status(200).json("Post has been liked")
      }
      else{
        await post.updateOne({$pull:{like:req.body.user}});
        return res.status(200).json("Post has been unliked")
      }
    } catch (error) {
      return res.status(500).json("internal server error1");
    }
  })
  
  //dislikes
  
  router.put("/:id/dislike",verifyToken,async(req,res)=>{
    try {
      
      const post=await Post.findById(req.params.id);
      if(!post.dislike.includes(req.body.user)){
        await post.updateOne({$push:{dislike:req.body.user}})
        return res.status(200).json("Post has been disliked")
      }
      else{
        await post.updateOne({$pull:{dislike:req.body.user}});
        return res.status(200).json("Post has been unliked")
      }
    } catch (error) {
      return res.status(500).json("internal server error2");
    }
  })
  
  //comment
  router.put("/comment/post",verifyToken,async(req,res)=>{
  try {
    const {comment,postid}=req.body;
    const commnets ={
      user:req.user.id,
      username:req.user.username,
      comment
    }
    const post=await Post.findById(postid);
    post.comments.push(commnets);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json("internal server error3");
  }
  })

//delete post

router.delete("/delete/post/:id",verifyToken,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id);
        if(post.user===req.user.id)
        {
            const deletepost=await Post.findByIdAndDelete(req.params.id);
            return res.status(200).json("your post has been deleted");
        }
        else{
            return res.status(400).json("you are not allowed to delete this post")
        }
    } catch (error) {
        return res.status(500).json("Internal server error");
    }
})
module.exports = router;
