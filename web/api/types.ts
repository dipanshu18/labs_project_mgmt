export interface IStudentDetails {
  name: string;
  rollNo: string;
  academicYear: string;
  batch: string;
  division: string;
}

export interface IProjectDetails {
  id: string;
  groupNo: string;
  title: string;
  description: string;
  batch: string;
  division: string;
  guide: {
    id: string;
    name: string;
    role: "TEACHER";
    userId: string;
  };
  teamMembers: {
    id: string;
    name: string;
    role: "STUDENT";
    rollNo: string;
    batch: number;
    division: string;
    academicYear: string;
    userId: string;
  }[];
  progress: {
    id: string;
    percentage: number;
    progressDescription: string;
  }[];
}

export interface IGroup {
  teamMembers: {
    id: string;
    name: string;
    role: "STUDENT";
    userId: string;
    rollNo: string;
    batch: number;
    division: string;
    academicYear: string;
  }[];
  id: string;
  groupNo: string;
  title: string;
  description: string;
  batch: string;
  division: string;
  guideId: string;
}

export interface IStudentsNotInGroup {
  id: string;
  name: string;
  role: "STUDENT";
  userId: string;
  rollNo: string;
  batch: number;
  division: string;
  academicYear: string;
}

export interface IAddGroup {
  groupNo: string;
  title: string;
  description: string;
  batch: string;
  division: string;
  groupMembers: string[];
}

export interface IGroupDetails {
  description: string;
  groupNo: string;
  guideId: string;
  id: string;
  title: string;
  batch: string;
  division: string;
  teamMembers: {
    id: string;
    name: string;
    role: "STUDENT";
    rollNo: string;
    batch: number;
    division: string;
    academicYear: string;
    userId: string;
  }[];
  progress: {
    id: string;
    percentage: number;
    progressDescription: string;
    createdAt: string;
  }[];
}
