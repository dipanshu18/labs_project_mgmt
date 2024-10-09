import { addProjectProgress } from "@/api/mutations";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditProjectProgressProps {
  groupId: string;
  currentPercentage: number; // Add currentPercentage prop
}

export function EditProjectProgress({
  groupId,
  currentPercentage,
}: EditProjectProgressProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [progressPercentage, setProgressPercentage] = useState("");
  const [description, setDescription] = useState("");

  const addProjectProgressMutation = useMutation({
    mutationKey: ["addProjectProgress"],
    mutationFn: () =>
      addProjectProgress(progressPercentage, description, groupId),
    onSuccess: () => {
      setProgressPercentage("");
      setDescription("");
      queryClient.invalidateQueries({
        queryKey: ["getProjectDetails"],
      });
      queryClient.invalidateQueries({
        queryKey: ["progress"],
      });
      router.replace("/student");
      router.refresh();
    },
  });

  // Create an array of percentage options
  const percentageOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  // Filter options based on the current percentage
  const filteredOptions = percentageOptions.filter(
    (option) => option > currentPercentage
  );

  return (
    <form className="space-y-5">
      <div className="space-y-2">
        <p>Progress:</p>
        <Select
          onValueChange={(value) => setProgressPercentage(value)}
          value={progressPercentage}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select progress %" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {filteredOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p>Progress description:</p>
        <Textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="Add progress description (e.g., implemented backend routes and database schema)"
          rows={5}
        />
      </div>

      <Button
        disabled={addProjectProgressMutation.isPending}
        onClick={(e) => {
          e.preventDefault();

          addProjectProgressMutation.mutate();
        }}
        className="w-full"
      >
        Save progress
      </Button>
    </form>
  );
}
