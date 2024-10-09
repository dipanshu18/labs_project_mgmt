"use client";

import { type FormEvent } from "react";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LogoutBtn() {
  const router = useRouter();

  async function handleLogout(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        const data = await response.data.msg;
        toast.success(data);
        router.replace("/");
        router.refresh();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorData = await error.response?.data.msg;
        toast.error(errorData);
      }
    }
  }

  return (
    <div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
