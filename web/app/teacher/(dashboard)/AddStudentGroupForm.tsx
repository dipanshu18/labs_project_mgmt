"use client";

import { addStudentGroup } from "@/api/mutations";
import { fetchStudentsNotInGroup } from "@/api/queries";
import { IAddGroup, IStudentsNotInGroup } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function AddStudentGroupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [group, setGroup] = useState<IAddGroup>({
    groupNo: "",
    title: "",
    description: "",
    batch: "",
    division: "",
    groupMembers: [],
  });

  const {
    data: studentsNotInGroup,
    isLoading,
    isError,
  } = useQuery<IStudentsNotInGroup[]>({
    queryKey: ["studentsNotInGroup", group.batch, group.division],
    queryFn: () => fetchStudentsNotInGroup(group.batch, group.division),
    enabled: !!group.batch && !!group.division,
  });

  const addStudentGroupMutation = useMutation({
    mutationKey: ["addStudentGroup"],
    mutationFn: addStudentGroup,
    onSuccess: () => {
      setGroup({
        groupNo: "",
        title: "",
        description: "",
        batch: "",
        division: "",
        groupMembers: [],
      });
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
      queryClient.invalidateQueries({
        queryKey: ["studentsNotInGroup"],
      });
      router.replace("/teacher");
      router.refresh();
    },
  });

  function removeMember(index: number) {
    const updatedMembers = [...group.groupMembers];
    updatedMembers.splice(index, 1);
    setGroup({ ...group, groupMembers: updatedMembers });
  }

  return (
    <form className="space-y-5">
      <div className="space-y-2">
        <p>Group No:</p>
        <Input
          onChange={(e) => setGroup({ ...group, groupNo: e.target.value })}
          value={group.groupNo}
          placeholder="group no (e.g. 201)"
        />
      </div>
      <div className="space-y-2">
        <p>Project title:</p>
        <Input
          onChange={(e) => setGroup({ ...group, title: e.target.value })}
          value={group.title}
          placeholder="group's project title"
        />
      </div>
      <div className="space-y-2">
        <p>Project description:</p>
        <Textarea
          onChange={(e) => setGroup({ ...group, description: e.target.value })}
          value={group.description}
          placeholder="project description"
        />
      </div>

      <div className="flex gap-5">
        <div className="w-full">
          <p>Batch:</p>

          <Select
            onValueChange={(value) => setGroup({ ...group, batch: value })}
            value={group.batch}
          >
            <SelectTrigger>
              <SelectValue placeholder="Batch" />
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
            onValueChange={(value) => setGroup({ ...group, division: value })}
            value={group.division}
          >
            <SelectTrigger>
              <SelectValue placeholder="Div" />
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
      {/* Conditionally render "Add group members" section only when batch and division are selected */}
      {group.batch && group.division && (
        <div className="space-y-2">
          <p>Add group members:</p>
          {group.groupMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2"
            >
              <p>{member}</p>
              <Button variant="destructive" onClick={() => removeMember(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Select
            onValueChange={(value) => {
              if (!group.groupMembers.includes(value)) {
                setGroup({
                  ...group,
                  groupMembers: [...group.groupMembers, value],
                });
              } else {
                toast("Student already added to the group.");
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select students for group" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {isLoading && <h1 className="font-bold">Loading...</h1>}
                {isError && !isLoading && (
                  <h1 className="font-bold">
                    Error while fetching students not in groups
                  </h1>
                )}
                {group.groupMembers.length === 3 ? (
                  <h1>Max no. of students alloted</h1>
                ) : studentsNotInGroup && studentsNotInGroup.length > 0 ? (
                  studentsNotInGroup
                    .filter(
                      (student) => !group.groupMembers.includes(student.name)
                    ) // Filter out already selected students
                    .map((student) => (
                      <SelectItem value={student.name} key={student.id}>
                        {student.name}
                      </SelectItem>
                    ))
                ) : (
                  <p className="text-sm">No students found</p>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button
        disabled={addStudentGroupMutation.isPending}
        onClick={(e) => {
          e.preventDefault();

          addStudentGroupMutation.mutate(group);
        }}
      >
        Add group
      </Button>
    </form>
  );
}
