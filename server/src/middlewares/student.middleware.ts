import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET as string;

import jwt, { JwtPayload } from "jsonwebtoken";

export default async function studentMiddleware(req, res, next) {
  const { session } = req.cookies;

  if (!session) {
    return res
      .status(401)
      .json({ msg: "Unauthorized. You are not allowed to access this page!" });
  }

  const decoded = jwt.verify(session, SECRET) as JwtPayload;

  if (!decoded) {
    return res.status(401).json({ msg: "Invalid token!" });
  }

  if (decoded.role !== "STUDENT") {
    return res.status(401).json({
      msg: "Unauthorized. Only student is allowed to access this page!",
    });
  }

  req.body.user = decoded;

  next();
}
