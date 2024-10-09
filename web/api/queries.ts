import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const BASE_URL = "http://localhost:8080/api/v1";

export async function fetchProjectDetails() {
  try {
    const response = await axios.get(`${BASE_URL}/students/project-details`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      const data = await response.data.projectDetails;
      return data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}

export async function fetchGroups() {
  try {
    const response = await axios.get(`${BASE_URL}/teachers/groups`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      const data = await response.data;
      return data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}

export async function fetchStudentsNotInGroup(batch: string, division: string) {
  const response = await axios.get(
    `${BASE_URL}/teachers/students?batch=${batch}&division=${division}`,
    {
      withCredentials: true,
    }
  );

  if (response.status === 200) {
    const data = await response.data;
    return data;
  }
}

export async function fetchGroupDetails(groupId: string) {
  try {
    const response = await axios.get(`${BASE_URL}/teachers/groups/${groupId}`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      const data = await response.data.groupProgress;
      return data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorData = await error.response?.data.msg;
      toast.error(errorData);
    }
  }
}
