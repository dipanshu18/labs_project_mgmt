"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditProjectProgress } from "./EditProjectProgress";
import { useQuery } from "@tanstack/react-query";
import { fetchProjectDetails } from "@/api/queries";
import { IProjectDetails } from "@/api/types";

export default function StudentDashboard() {
  const {
    data: projectDetails,
    isLoading,
    isError,
  } = useQuery<IProjectDetails>({
    queryKey: ["getProjectDetails"],
    queryFn: fetchProjectDetails,
  });

  if (isLoading) {
    return <h1 className="text-center text-2xl font-extrabold">Loading...</h1>;
  }

  if (isError && !isLoading) {
    return (
      <h1 className="text-center text-2xl font-extrabold">
        Error while fetching project details
      </h1>
    );
  }

  return (
    <>
      {projectDetails ? (
        <div className="space-y-5">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">{projectDetails?.title}</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Edit Progress</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit project progress</DialogTitle>
                </DialogHeader>
                <EditProjectProgress
                  groupId={projectDetails.id}
                  currentPercentage={
                    projectDetails?.progress[projectDetails.progress.length - 1]
                      .percentage
                  }
                />
              </DialogContent>
            </Dialog>
          </div>
          <p>{projectDetails?.description}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Division</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectDetails?.teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.rollNo}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.batch}</TableCell>
                  <TableCell>{member.division}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center space-y-5">
          <h1 className="text-3xl font-bold">
            You have not any group and project assigned yet!
          </h1>
          <h2 className="text-xl">Contact your guide for further details</h2>
        </div>
      )}
    </>
  );
}
