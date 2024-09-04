
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Token not found",
        success: false,
      });
    }

    const verifiedToken = await jwt.verify(token, process.env.secretKey);
    if (!verifiedToken) {
      console.log("Token not verified")
      return res.status(401).json({
        message: "Token is not valid",
        success: false,
      });
    }
    req.id = verifiedToken.carerId;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;