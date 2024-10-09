"use client";

import { fetchGroups } from "@/api/queries";
import { IGroup } from "@/api/types";
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

export function Groups() {
  const {
    data: groups,
    isError,
    isLoading,
  } = useQuery<IGroup[]>({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  if (isLoading) {
    return <h1 className="text-center text-2xl font-bold">Loading...</h1>;
  }

  if (isError && !isLoading) {
    return (
      <h1 className="text-center text-2xl font-bold">
        Error while fetching groups...
      </h1>
    );
  }

  // Helper function to render tables for each batch under a division
  const renderBatchTable = (division: string, batch: number) => {
    const filteredGroups = groups?.filter(
      (group) => group.division === division && Number(group.batch) === batch
    );

    return (
      <>
        {filteredGroups && filteredGroups.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Group No</TableHead>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.groupNo}</TableCell>
                    <TableCell>{group.title}</TableCell>
                    <TableCell>{group.division}</TableCell>
                    <TableCell>{group.batch}</TableCell>
                    <TableCell>
                      <Link href={`/teacher/${group.id}`}>Details</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <h1 className="text-md my-3">
            No groups formed for Division {division} Batch {batch}
          </h1>
        )}
      </>
    );
  };

  return (
    <>
      {groups && groups?.length > 0 ? (
        <>
          {/* Division A */}
          <h2 className="mt-5 text-2xl font-bold">Division A Groups</h2>
          <h1 className="mt-5 text-xl font-bold">Batch 1</h1>

          {renderBatchTable("A", 1)}

          <h1 className="mt-5 text-xl font-bold">Batch 2</h1>

          {renderBatchTable("A", 2)}

          <h1 className="mt-5 text-xl font-bold">Batch 3</h1>

          {renderBatchTable("A", 3)}

          <h1 className="mt-5 text-xl font-bold">Batch 4</h1>

          {renderBatchTable("A", 4)}

          {/* Division B */}
          <h2 className="mt-5 text-2xl font-bold">Division B Groups</h2>

          <h1 className="mt-5 text-xl font-bold">Batch 1</h1>

          {renderBatchTable("B", 1)}

          <h1 className="mt-5 text-xl font-bold">Batch 2</h1>

          {renderBatchTable("B", 2)}

          <h1 className="mt-5 text-xl font-bold">Batch 3</h1>

          {renderBatchTable("B", 3)}

          <h1 className="mt-5 text-xl font-bold">Batch 4</h1>

          {renderBatchTable("B", 4)}
        </>
      ) : (
        <h1 className="text-center text-2xl font-bold my-5">
          No groups are formed yet
        </h1>
      )}
    </>
  );
}
