import CreatedJobs from "@/components/createdjobs";
import CreatedApplications from "@/components/createdapplications";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
const MyJob = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
  return (
    <div>
      <h1 className="pb-8 text-5xl font-extrabold text-center gradient-title sm:text-7xl">
        {user?.unsafeMetadata?.role === "candidate"
          ? "My Applications"
          : "My Jobs"}
      </h1>
      {user?.unsafeMetadata?.role === "candidate" ? (
        <CreatedApplications />
      ) : (
        <CreatedJobs />
      )}
    </div>
  )
}

export default MyJob
