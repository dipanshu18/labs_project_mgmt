"use client";

import { fetchGroupDetails } from "@/api/queries";
import { IGroupDetails } from "@/api/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function GroupDetailComp({ groupId }: { groupId: string }) {
  const {
    data: details,
    isLoading,
    isError,
  } = useQuery<IGroupDetails>({
    queryKey: ["groupDetails"],
    queryFn: () => fetchGroupDetails(groupId),
  });

  if (isLoading) {
    return <h1 className="text-center text-2xl font-bold">Loading...</h1>;
  }

  if (isError && !isLoading) {
    return (
      <h1 className="text-center text-2xl font-bold">
        Error while fetching group details
      </h1>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{details?.title}</h2>
        <Link href={`/teacher/${groupId}/progress`}>
          <Button>Progress</Button>
        </Link>
      </div>

      <p>{details?.description}</p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Roll No</TableHead>
            <TableHead>Student name</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Division</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {details?.teamMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.rollNo}</TableCell>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.batch}</TableCell>
              <TableCell>{member.division}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
