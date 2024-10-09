import { GroupDetailComp } from "./GroupDetail";

export default function GroupDetails({
  params,
}: {
  params: { groupId: string };
}) {
  return (
    <div className="space-y-5">
      <GroupDetailComp groupId={params.groupId} />
    </div>
  );
}
