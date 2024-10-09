import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddStudentGroupForm } from "./AddStudentGroupForm";
import { Groups } from "./Groups";

export default function TeacherDashboard() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-wrap md:flex-nowrap gap-5">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Add group</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add student group</DialogTitle>
            </DialogHeader>
            <AddStudentGroupForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full">
        <Groups />
      </div>
    </div>
  );
}
