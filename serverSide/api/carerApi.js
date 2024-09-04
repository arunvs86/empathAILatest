import { Carer } from "../schema/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getImageUri from "../helpers/uri.js";
import cloudinary from "../helpers/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const  username = req.body.userName;
    const  password = req.body.password;

    if (!username || !password) {
      res.status(401).json({
        message: "Either username or password is missing, please check",
        success: false,
      });
    }
    const carer = await Carer.findOne({ userName: username });
    if (carer) {
      return res.status(401).json({
        message:
          "User already exists. Try signing up with a different username",
        success: false,
      });
    }
 
    const encyptedPassword = await bcrypt.hash(password, 10);
    await Carer.create({
      userName: username,
      password: encyptedPassword,
    });
    return res.status(201).json({
      message: "User Registration successful. ",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async(req,res) => {
    try{
      const  username = req.body.userName;
      const  password = req.body.password;

        if(!username || !password){
            res.status(401).json({
                message: "Either username or password is missing, please check",
                success: false,
              });
        }
      
    let carer = await Carer.findOne({ userName: username })
                .populate({
                 path: "careGivers"})
                .populate({
                  path: "caringFor"
                })

    if (!carer) {
      return res.status(401).json({
        message:
          "Incorrect username or passeord. Please try again",
        success: false,
      });
    }
    const verifyPassword = await bcrypt.compare(password,carer.password);
    if(!verifyPassword){
        return res.status(401).json({
            message:
          "Incorrect passeord. Please try again",
        success: false,
        })  
    }

    carer = {
        _id: carer._id,
        userName: carer.userName,
        userDp: carer.userDp,
        userAbout: carer.userAbout,
        caringFor: carer.caringFor,
        careGivers: carer.careGivers,
        thoughts: carer.thoughts,
    }

    const token = await jwt.sign({carerId:carer._id},process.env.secretKey,{expiresIn:'1d'});
    return res.cookie('token',token,{httpOnnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
        message:`Welcome ${carer.userName}`,
        success:true,
        carer
    })
    } catch(error){
        console.log(error)
    }
};

export const signOut = async(req,res) => {
  try{
      return res.cookie("token","",{maxAge:0}).json({
        message:"Signed out succesfully",
        success: true
      })
  } catch(error){
    console.log(error)
  }
};

export const getProfile = async(req,res) => {
  try{
    const carerId = req.params.id;
    const carer = await Carer.findById(carerId)
    .populate({
      path: 'thoughts'
    })
    .populate({
      path: 'bookmarks'
    });
    
    return res.status(200).json({
      carer,
      success:true
    })
  } catch(error){
    console.log(error)
  }
};

export const editProfile = async (req,res) => {
  try{
    const carerId = req.id;
    const {userAbout} = req.body;
    const userDp = req.file;

    let responseImageString;
    if(userDp){
      const imageUri = getImageUri(userDp);
      responseImageString = await cloudinary.uploader.upload(imageUri);
    }

    const carer = await Carer.findById(carerId);
    if(!carer){
      return res.status(401).json({
        message:'User not found in the database',
        success:false
      })
    };
    if(userAbout){
      carer.userAbout = userAbout
    }

    if(userDp){
      carer.userDp = responseImageString.secure_url;
    }

    await carer.save();

    return res.status(200).json({
      message:'Profile updated successfully',
      success: true,
      carer
    })
  }catch(error){
    console.log(error)
  }
}

export const findUsers = async (req, res) => {
  try {
      const carers = await Carer.find({ _id: { $ne: req.id } }).select("-password");
      if (!carers) {
          return res.status(400).json({
              message: 'Currently there are no users in the application',
          })
      };
      return res.status(200).json({
          success: true,
          carers: carers
      })
  } catch (error) {
      console.log(error);
  }
};

export const careOrBeTakenCareOf = async (req, res) => {
  try {
      const carerId = req.body.careGiver;
      const carerToBeTakenCareOf = req.body.caringFor;

      console.log("Current User id: ", carerId)
      console.log("Other User id : ", carerToBeTakenCareOf)


      if (carerId === carerToBeTakenCareOf) {
          return res.status(400).json({
              message: 'Invalid operation. Something went wrong',
              success: false
          });
      }

      const carer = await Carer.findById(carerId)
                    .populate({
                      path:"careGivers"
                    })
                    .populate({
                      path:"caringFor"
                    });

      const targetCarer = await Carer.findById(carerToBeTakenCareOf)
                          .populate({
                            path:"careGivers"
                          })
                          .populate({
                            path:"caringFor"
                          })
                          .populate({
                            path:"thoughts"
                          })
                          .populate({
                            path:"bookmarks"
                          })
                          .select("-password")

      if (!carer || !targetCarer) {
          return res.status(400).json({
              message: 'User not found',
              success: false
          });
      }

      const isFollowing = carer.caringFor.some(care => care._id.toString() === targetCarer._id.toString());

      console.log("isFollowing: ", isFollowing)

      if (isFollowing) {
          await Promise.all([
              Carer.updateOne({ _id: carerId }, { $pull: { caringFor: carerToBeTakenCareOf } }),
              Carer.updateOne({ _id: carerToBeTakenCareOf }, { $pull: { careGivers: carerId } }),
          ])

          const responseCarer = await Carer.findById(carerId)
          .populate({
            path:"careGivers"
          })
          .populate({
            path:"caringFor"
          });

          const responseTargetCarer = await Carer.findById(carerToBeTakenCareOf)
          .populate({
            path:"careGivers"
          })
          .populate({
            path:"caringFor"
          });
          
          return res.status(200).json({ message: 'You will not see be able to see their thoughts anymore.', success: true, carer:responseCarer,targetCarer:responseTargetCarer });
      }
      else {
          await Promise.all([
            Carer.updateOne({ _id: carerId }, { $push: { caringFor: carerToBeTakenCareOf } }),
            Carer.updateOne({ _id: carerToBeTakenCareOf }, { $push: { careGivers: carerId } }),
          ])

          const responseCarer = await Carer.findById(carerId)
          .populate({
            path:"careGivers"
          })
          .populate({
            path:"caringFor"
          });

          const responseTargetCarer = await Carer.findById(carerToBeTakenCareOf)
          .populate({
            path:"careGivers"
          })
          .populate({
            path:"caringFor"
          });

          return res.status(200).json({ message: 'You will now be able to see the thoughts of this carer', success: true, care:responseCarer,targetCarer:responseTargetCarer});
      }
  } catch (error) {
      console.log(error);
  }
}

