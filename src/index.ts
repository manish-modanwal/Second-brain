 

import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { ContentModel, LinkModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
const app = express();
app.use(express.json( ))
import { JWT_PASSWORD } from "./config"; 
import { random } from "./utils";
import cors from "cors";
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const newUser = await UserModel.create({
      username,
      password
    });

    res.json(
        {
      message: "User signed up successfully",
      user: newUser
    });
  } catch (err) {
    console.error("Signup Error:", err); // 👈 See the actual error
    res.status(411).json({
      error: "Internal Server Error",
     
    });
  }
});


app.post("/api/v1/signin" ,async(req,res)=>{

    const {username, password}= req.body;

    const existingUser= await UserModel.findOne({
        username,
        password

    })

    if(existingUser){
        const token = jwt.sign({
            id:existingUser._id
        }, JWT_PASSWORD)
        res.json({
            token
        })
    }
    else{
          res.status(403).json({
            message:'incorrect credentials'
          })
    }


})

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
        link,
         
        type,
        title: req.body.title,
        //@ts-ignore
        userId: req.userId,
        tags: []
    })

    res.json({
        message: "Content added"
    })
    
})

app.get("/api/v1/content",userMiddleware ,async (req,res)=>{
 
  //@ts-ignore
  const userId=req.userId;
  const content=await ContentModel.find({
    userId:userId
  }).populate("userId", "username")

  res.json({
    content
  })


    
})

app.delete("/api/v1/content" ,userMiddleware,async (req,res)=>{

  const contentId = req.body.contentId;

  await ContentModel.deleteMany({
    contentId,
    //@ts-ignore
    userId:req.userId
  })

  res.json({
    message:"delted the content"
  })

})

app.post("/api/v1/brain/share",userMiddleware,async(req,res)=>{
  const share=req.body.share;
  //@ts-ignore

  const hash =random(10)
  if(share){

     const existingLink = await LinkModel.findOne({
      //@ts-ignore
      userId: req.userId
    });
  

   if (existingLink) {
  return res.json({
    hash: existingLink.hash
  });
  }
    
     await LinkModel.create({
      //@ts-ignore
      userId: req.userId,
      hash:hash,
    })

    res.json({
      message : "/share/" + hash
    })
  }
  else{
   await LinkModel.deleteOne({
    //@ts-ignore
      userId: req.userId,
    })

     res.json({
    message: "Share link deleted"
    })
  }

 


})

app.get("/api/v1/brain/:shareLink", async (req,res)=>{ 

  const hash = req.params.shareLink;

 

  const link = await LinkModel.findOne({
   hash
  })

  if(!link){
    return res.status(404).json({
      message: "Share link not found"
    })
  }

  const content = await ContentModel.find({
    userId: link.userId
  }).populate("userId", "username");

  const user= await UserModel.findOne({
    _id: link.userId
  })

  if (!user) {
  return res.status(404).json({
    message: "User not found"
  });
  }

  res.json({
    content,
    user: {
      username: user.username,
      id: user._id
    }
  })

})

app.listen(3000, () => {
  console.log(`🚀 Server is running on http://localhost:${3000}`);
});