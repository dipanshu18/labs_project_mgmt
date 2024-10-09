import dotenv from "dotenv";
dotenv.config();

const SECRET = process.env.SECRET as string;

import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import axios from "axios";

const userModel = new PrismaClient().user;
const teacherModel = new PrismaClient().teacher;
const studentModel = new PrismaClient().student;
const groupModel = new PrismaClient().group;
const progressModel = new PrismaClient().progress;

export async function createTeacher(req, res) {
  try {
    const { name, email } = req.body;

    const teacherExists = await teacherModel.findFirst({
      where: {
        user: {
          email,
        },
      },
    });

    if (teacherExists) {
      return res
        .status(400)
        .json({ msg: "Teacher already exists with this email. Kindly login!" });
    }

    if (name.length < 3) {
      return res.status(400).json({ msg: "Name must be 3 characters long!" });
    }

    const user = await userModel.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "Please verify your email first!" });
    }

    const newTeacher = await teacherModel.create({
      data: {
        name,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    if (newTeacher) {
      const token = jwt.sign(
        { id: newTeacher.id, userId: newTeacher.userId, role: "TEACHER" },
        SECRET
      );
      res.cookie("session", token);
      res.cookie("user", "TEACHER");
      return res.status(201).json({ msg: "Teacher account created!" });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ msg: "Internal server error!" });
  }
}

export async function loginTeacher(req, res) {
  try {
    const { email, otp } = req.body;

    const teacherExists = await teacherModel.findFirst({
      where: {
        user: {
          email,
        },
      },
    });

    if (!teacherExists) {
      return res
        .status(404)
        .json({ msg: "Teacher account doesn't exists. Kindly create one!" });
    }

    const response = await axios.post(
      "http://localhost:8080/api/v1/verify-user/verify",
      { email, otp }
    );

    const data = await response.data;
    if (response.status === 200) {
      const token = jwt.sign(
        { id: teacherExists.id, userId: teacherExists.userId, role: "TEACHER" },
        SECRET
      );
      res.cookie("session", token);
      res.cookie("user", "TEACHER");
      return res.status(200).json({ msg: "Credentials verified!" });
    }

    return res.status(400).json({ msg: data.msg });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ msg: "Internal server error!" });
  }
}

export async function getAllGroups(req, res) {
  try {
    const groups = await groupModel.findMany({
      include: {
        teamMembers: true,
      },
    });

    return res.status(200).json(groups);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ msg: "Internal server error!" });
  }
}

export async function getAllStudents(req, res) {
  try {
    const { batch, division } = req.query;

    const studentsNotInGroup = await studentModel.findMany({
      where: {
        batch: Number(batch),
        division,
        group: {
          none: {},
        },
      },
    });

    return res.status(200).json(studentsNotInGroup);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ msg: "Internal server error!" });
  }
}

export async function createGroup(req, res) {
  try {
    const { groupNo, title, description, batch, division, groupMembers } =
      req.body; // groupMembers contains names
    const guideId = req.body.user["id"]; // Assuming guideId is available from req

    // Step 1: Resolve student IDs from the provided names
    const students = await studentModel.findMany({
      where: {
        name: { in: groupMembers }, // Use the names from the frontend to find the corresponding students
      },
      select: {
        id: true, // Only get the IDs of the students
      },
    });

    // Check if all provided names were resolved to valid student IDs
    if (students.length !== groupMembers.length) {
      return res.status(400).json({
        msg: "One or more selected students do not exist.",
      });
    }

    const studentIds = students.map((student) => student.id); // Extract the IDs from the student data

    // Step 2: Ensure none of the selected students are already in a group
    const alreadyGroupedStudents = await studentModel.findMany({
      where: {
        id: { in: studentIds },
        group: {
          some: {}, // Check if any students are already in a group
        },
      },
    });

    if (alreadyGroupedStudents.length > 0) {
      return res.status(400).json({
        msg: "One or more selected students are already in a group.",
      });
    }

    // Step 3: Create the new group
    const newGroup = await groupModel.create({
      data: {
        groupNo,
        title,
        description,
        batch: Number(batch),
        division,
        teamMembers: {
          connect: studentIds.map((id) => ({ id })), // Connect the selected students using their IDs
        },
        guide: {
          connect: {
            id: guideId, // Connect guide based on their ID
          },
        },
        progress: {
          // Create an initial progress record as part of the group creation
          create: {
            percentage: 0,
            progressDescription: "Topic approval",
          },
        },
      },
    });

    return res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    return res
      .status(500)
      .json({ msg: "An error occurred while creating the group." });
  }
}

export async function getGroupProgress(req, res) {
  try {
    const { groupId } = req.body;
    const groupProgress = await groupModel.findFirst({
      where: {
        id: groupId,
      },
      include: {
        progress: true,
        teamMembers: true,
      },
    });

    return res.status(200).json({ groupProgress });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ msg: "Internal server error!" });
  }
}
