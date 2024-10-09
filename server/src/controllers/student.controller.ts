import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET as string;

import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import axios from "axios";

const userModel = new PrismaClient().user;
const studentModel = new PrismaClient().student;
const groupModel = new PrismaClient().group;
const progressModel = new PrismaClient().progress;

export async function createStudent(req, res) {
  try {
    const { name, email, academicYear, batch, division, rollNo } = req.body;

    const studentExists = await studentModel.findFirst({
      where: {
        user: {
          email,
        },
      },
    });

    if (studentExists) {
      return res
        .status(400)
        .json({ msg: "Student already exists with this email. Kindly login!" });
    }

    const user = await userModel.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json({ msg: "Please verify your email first!" });
    }

    const newStudent = await studentModel.create({
      data: {
        name,
        academicYear,
        batch: Number(batch),
        division,
        rollNo,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    if (newStudent) {
      const token = jwt.sign(
        { id: newStudent.id, userId: newStudent.userId, role: "STUDENT" },
        SECRET
      );
      res.cookie("session", token);
      res.cookie("user", "STUDENT");
      return res.status(201).json({ msg: "Student account created!" });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ msg: "Internal server error!" });
  }
}

export async function loginStudent(req, res) {
  try {
    const { email, otp } = req.body;

    const studentExists = await studentModel.findFirst({
      where: {
        user: {
          email,
        },
      },
    });

    if (!studentExists) {
      return res
        .status(404)
        .json({ msg: "Student account doesn't exists. Kindly create one!" });
    }

    const response = await axios.post(
      "http://localhost:8080/api/v1/verify-user/verify",
      { email, otp }
    );

    const data = await response.data;
    if (response.status === 200) {
      const token = jwt.sign(
        { id: studentExists.id, userId: studentExists.userId, role: "STUDENT" },
        SECRET
      );
      res.cookie("session", token);
      res.cookie("user", "STUDENT");
      return res.status(200).json({ msg: "Credentials verified!" });
    }

    return res.status(400).json({ msg: data.msg });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ msg: "Internal server error!" });
  }
}

export async function getProjectDetails(req, res) {
  try {
    const { id } = req.body.user;
    const projectDetails = await groupModel.findFirst({
      where: {
        teamMembers: {
          some: {
            id,
          },
        },
      },
      include: {
        progress: true,
        teamMembers: true,
        guide: true,
      },
    });

    return res.status(200).json({ projectDetails });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ msg: "Internal server error!" });
  }
}

export async function updateProjectProgress(req, res) {
  try {
    const { groupId, progressPercentage, description } = req.body;

    const updateProgress = await progressModel.create({
      data: {
        percentage: Number(progressPercentage),
        progressDescription: description,
        group: {
          connect: {
            id: groupId, // Use 'group' instead of 'Group' to match the schema
          },
        },
      },
    });

    if (updateProgress) {
      return res.status(200).json({ msg: "Progress added successfully." });
    }
  } catch (error) {
    console.error("Error updating project progress:", error);
    return res.status(500).json({ msg: "Internal server error." });
  }
}
