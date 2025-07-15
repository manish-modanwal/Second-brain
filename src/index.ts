 

import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { ContentModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
const app = express();
app.use(express.json( ))
import { JWT_PASSWORD } from "./config"; 

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

app.post("/api/v1/content" ,userMiddleware, async (req,res)=>{

    const link= req.body.link;
    const title= req.body.title;

    await ContentModel.create({
        title: req.body.title,
        link: req.body.link,
         // if any
        //@ts-ignore
        userId: req.userId,
        tags: []
    })

    return res.json({
      message:"content added"
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

app.post("/api/v1/brain/share",(req,res)=>{

})

app.get("/api/v1/brain/:shareLink", (req,res)=>{

})

app.listen(3000);