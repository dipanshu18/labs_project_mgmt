import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { IAddGroup, IStudentDetails } from "./types";

const BASE_URL = "http://localhost:8080/api/v1";

export async function sendOtp(email: string) {
  try {
    const response = await axios.post(`${BASE_URL}/verify-user/send`, {
      email,
    });

    if (response.status === 200) {
      const data = await response.data.msg;
      toast.success(data);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}

export async function emailOtpVerify(email: string, otp: string) {
  try {
    const response = await axios.post(`${BASE_URL}/verify-user/verify`, {
      email,
      otp,
      type: "signup",
    });

    if (response.status === 201) {
      const data = await response.data.msg;
      toast.success(data);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}

export async function studentSignup(
  email: string,
  studentDetails: IStudentDetails
) {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/students/signup",
      { email, ...studentDetails },
      { withCredentials: true }
    );

    if (response.status === 201) {
      const data = await response.data.msg;
      toast.success(data);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}

export async function studentLogin(email: string, otp: string) {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/students/login",
      { email, otp, type: "login" },
      { withCredentials: true }
    );

    if (response.status === 200) {
      const data = await response.data.msg;
      toast.success(data);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}

export async function teacherSignup(name: string) {
  try {
    const response = await axios.post(
      `${BASE_URL}/teachers/signup`,
      { name },
      { withCredentials: true }
    );

    if (response.status === 201) {
      const data = await response.data.msg;
      toast.success(data);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}

export async function teacherLogin(email: string, otp: string) {
  try {
    const response = await axios.post(
      `${BASE_URL}/teachers/login`,
      { email, otp, type: "login" },
      { withCredentials: true }
    );

    if (response.status === 200) {
      const data = await response.data.msg;
      toast.success(data);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}

export async function addStudentGroup(group: IAddGroup) {
  if (group.groupMembers.length < 3) {
    toast.error("Please select at least 3 unique members.");
    return;
  }

  try {
    const response = await axios.post(`${BASE_URL}/teachers/groups`, group, {
      withCredentials: true,
    });

    if (response.status === 201) {
      toast.success("Group created successfully!");
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}

export async function addProjectProgress(
  progressPercentage: string,
  description: string,
  groupId: string
) {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/students/update-progress",
      { progressPercentage, description, groupId },
      { withCredentials: true }
    );

    if (response.status === 200) {
      const data = await response.data.msg;
      toast.success(data);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}
