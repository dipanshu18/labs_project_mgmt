import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="space-y-5">
      <h1 className="text-5xl font-extrabold">
        Rosp Lab Mini Project Management
      </h1>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dignissimos
        nihil dolorum illum cum distinctio veritatis accusamus deserunt a eaque
        molestiae soluta nesciunt placeat eum, incidunt tempore rerum veniam
        aliquid ipsa ab necessitatibus omnis consequuntur minus? A ipsum, omnis
        qui minus obcaecati cupiditate, reiciendis soluta ad pariatur corrupti
        dolorum quos at voluptatibus suscipit aliquid necessitatibus officiis
        aperiam, accusantium expedita vitae porro blanditiis? Fugiat amet
        blanditiis assumenda consequatur dolore, illum dolores, dolor sed odio,
        aspernatur laboriosam vel? Repudiandae ut cumque nobis perspiciatis.
        Officia dolorum consequuntur quo qui quas hic animi eius quam illum
        ducimus, corrupti nemo sapiente vel quia nesciunt, possimus ex?
      </p>

      <div className="flex gap-10">
        <Link href="/teacher/signup">
          <Button variant="secondary">Get started as teacher</Button>
        </Link>
        <Link href="/student/signup">
          <Button>Get started as student</Button>
        </Link>
      </div>
    </div>
  );
}
