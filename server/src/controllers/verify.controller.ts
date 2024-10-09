import dotenv from "dotenv";
dotenv.config();

const EMAIL = process.env.NODEMAILER_EMAIL;
const PASSWORD = process.env.NODEMAILER_EMAIL_PASS;

import { Request, Response } from "express";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const otpStore: { [email: string]: { otp: string } } = {};
const userModel = new PrismaClient().user;

export async function sendOtp(req, res) {
  try {
    const { email } = req.body;

    let transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });

    const otp = Math.floor(Math.random() * 900000 + 100000).toString();
    otpStore[email] = { otp };

    let mailOptions = {
      from: EMAIL,
      to: email,
      subject: "OTP for verification",
      html: `OTP for email verification is: <b>${otp}</b>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log("Email sent: " + info.response);
    });

    return res.status(200).json({ msg: "Email sent!" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp, type } = req.body;

    if (!otp) {
      return res.status(400).json({ msg: "Please provide otp!" });
    }

    if (otpStore[email].otp === otp) {
      const userExists = await userModel.findFirst({
        where: {
          email,
        },
      });

      if (!userExists && type === "signup") {
        await userModel.create({
          data: {
            email,
            emailVerified: true,
          },
        });
        return res.status(201).json({ msg: "Email verified!" });
      }

      return res.status(200).json({ msg: "Email verified!" });
    }

    return res.status(400).json({ msg: "Invalid OTP!" });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}
