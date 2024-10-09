"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import { emailOtpVerify, sendOtp, teacherSignup } from "@/api/mutations";

export function TeacherSignupForm() {
  const router = useRouter();

  const [emailVerified, setEmailVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

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

  const teacherSignupMutation = useMutation({
    mutationKey: ["teacherSignup"],
    mutationFn: teacherSignup,
    onSuccess: () => {
      router.replace("/teacher");
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
        <div className="">
          <p>Name:</p>
          <Input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Name (e.g. Dipanshu Torawane)"
          />
        </div>
      )}
      <div>
        <p>
          Already registered?{" "}
          <span className="underline">
            <Link href="/teacher/login">Login</Link>
          </span>
        </p>
      </div>
      <div>
        <Button
          onClick={(e) => {
            e.preventDefault();

            teacherSignupMutation.mutate(name);
          }}
          className="w-full"
        >
          Signup
        </Button>
      </div>
    </form>
  );
}
