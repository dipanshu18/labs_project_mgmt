"use client";

import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetchGroupDetails } from "@/api/queries";
import { IGroupDetails } from "@/api/types";

export default function GroupProjectProgress({
  params,
}: {
  params: { groupId: string };
}) {
  const {
    data: details,
    isLoading,
    isError,
  } = useQuery<IGroupDetails>({
    queryKey: ["progress"],
    queryFn: () => fetchGroupDetails(params.groupId),
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
      <h1 className="text-2xl font-bold">Project progress</h1>

      <div className="border-l-2 border-neutral-300 flex flex-col space-y-5">
        {details?.progress &&
          details.progress.map((progress) => (
            <div key={progress.id} className="flex items-center space-y-5">
              <div className="border-b-2 border-neutral-300">
                <div className="px-5"></div>
              </div>
              <div className="pl-2 border py-5 px-10 rounded-xl w-full border-neutral-300">
                <h1 className="">
                  Project percentage:{" "}
                  <span className="text-xl font-extrabold">
                    {progress.percentage}%
                  </span>
                </h1>
                <p>{progress.progressDescription}</p>
                <p className="text-sm">
                  {formatDistanceToNow(new Date(progress.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
