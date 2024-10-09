"use client";

import { emailOtpVerify, sendOtp, studentSignup } from "@/api/mutations";
import { IStudentDetails } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function StudentSignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [studentDetails, setStudentDetails] = useState<IStudentDetails>({
    name: "",
    rollNo: "",
    academicYear: "",
    batch: "",
    division: "",
  });

  const [emailVerified, setEmailVerified] = useState(false);

  const sendOtpMutation = useMutation({
    mutationKey: ["sendOtp"],
    mutationFn: sendOtp,
  });

  const verifyEmailMutation = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: () => emailOtpVerify(email, otp),
    onSuccess: () => {
      setEmailVerified(true);
    },
  });

  const studentSignupMutation = useMutation({
    mutationKey: ["studentSignup"],
    mutationFn: () => studentSignup(email, studentDetails),
    onSuccess: () => {
      router.replace("/student");
      router.refresh();
    },
  });

  return (
    <form className="border rounded-xl shadow flex flex-col space-y-5 max-w-xl mx-auto p-5">
      {!emailVerified && (
        <>
          <div className="space-y-2">
            <p>Enter your email:</p>
            <div className="flex gap-5">
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Registered @vit.edu.in email"
              />
              <Button
                disabled={sendOtpMutation.isPending}
                onClick={(e) => {
                  e.preventDefault();

                  sendOtpMutation.mutate(email);
                }}
              >
                Send otp
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p>Enter OTP:</p>
            <div className="flex gap-5">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button
                disabled={verifyEmailMutation.isPending}
                onClick={(e) => {
                  e.preventDefault();

                  verifyEmailMutation.mutate();
                }}
              >
                Verify otp
              </Button>
            </div>
          </div>
        </>
      )}

      {emailVerified && (
        <>
          <div>
            <p>Name:</p>
            <Input
              onChange={(e) =>
                setStudentDetails({ ...studentDetails, name: e.target.value })
              }
              value={studentDetails.name}
              type="text"
              placeholder="Name (e.g. Dipanshu Torawane)"
            />
          </div>
          <div>
            <p>Roll No:</p>
            <Input
              onChange={(e) =>
                setStudentDetails({ ...studentDetails, rollNo: e.target.value })
              }
              value={studentDetails.rollNo}
              type="text"
              placeholder="Your roll no (e.g. 21101A0034)"
            />
          </div>
          <div>
            <p>Academic year:</p>
            <Input
              type="text"
              onChange={(e) =>
                setStudentDetails({
                  ...studentDetails,
                  academicYear: e.target.value,
                })
              }
              value={studentDetails.academicYear}
              placeholder="Your current academic year (2024)"
            />
          </div>
          <div className="w-full flex gap-5 flex-wrap md:flex-nowrap">
            <div className="w-full">
              <p>Batch:</p>
              <Select
                onValueChange={(value) =>
                  setStudentDetails({ ...studentDetails, batch: value })
                }
                value={studentDetails.batch}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select your batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <p>Division:</p>
              <Select
                onValueChange={(value) =>
                  setStudentDetails({ ...studentDetails, division: value })
                }
                value={studentDetails.division}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select your division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}

      <div>
        <p>
          Already registered?{" "}
          <span className="underline">
            <Link href="/student/login">Login</Link>
          </span>
        </p>
      </div>
      <div>
        <Button
          disabled={studentSignupMutation.isPending}
          onClick={(e) => {
            e.preventDefault();

            studentSignupMutation.mutate();
          }}
          className="w-full"
        >
          Signup
        </Button>
      </div>
    </form>
  );
}
