"use client";

import { sendOtp, teacherLogin } from "@/api/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TeacherLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtpMutation = useMutation({
    mutationKey: ["sendOtp"],
    mutationFn: sendOtp,
  });

  const teacherLoginMutation = useMutation({
    mutationKey: ["teacherLogin"],
    mutationFn: () => teacherLogin(email, otp),
    onSuccess: () => {
      router.replace("/teacher");
      router.refresh();
    },
  });

  return (
    <form className="border rounded-xl shadow flex flex-col space-y-5 max-w-xl mx-auto p-5">
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
        <InputOTP maxLength={6} onChange={(value) => setOtp(value)} value={otp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div>
        <p>
          Not registered yet?{" "}
          <span className="underline">
            <Link href="/teacher/signup">Create account</Link>
          </span>
        </p>
      </div>
      <div>
        <Button
          disabled={teacherLoginMutation.isPending}
          onClick={(e) => {
            e.preventDefault();

            teacherLoginMutation.mutate();
          }}
          className="w-full"
        >
          Login
        </Button>
      </div>
    </form>
  );
}
