import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET as string;

import jwt, { JwtPayload } from "jsonwebtoken";

export default async function teacherMiddleware(req, res, next) {
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

  req.body.user = decoded;

  next();
}
