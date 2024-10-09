import Link from "next/link";
import { Button } from "./ui/button";
import { cookies } from "next/headers";
import { LogoutBtn } from "./logout-btn";

export function Navbar() {
  const session = cookies().get("session")?.value;
  const user = cookies().get("user")?.value;

  return (
    <nav className="flex justify-between px-8 py-4 sticky top-0 backdrop-blur-md">
      <Link
        href={session ? (user === "STUDENT" ? "/student" : "/teacher") : "/"}
      >
        <h1 className="font-bold text-xl">Project Mgmt</h1>
      </Link>

      {session ? (
        <LogoutBtn />
      ) : (
        <div className="flex gap-5">
          <div>
            <Link href="/teacher/login">
              <Button>Login as teacher</Button>
            </Link>
          </div>
          <div>
            <Link href="/student/login">
              <Button>Login as student</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
