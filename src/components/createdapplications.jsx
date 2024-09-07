import { useUser } from "@clerk/clerk-react";
import Applicationcart from './applicationcart';
import { useEffect } from "react";
import { getApplications } from '@/api/apiapplication';
import useFetch from "@/hooks/use_fatch";
import { BarLoader } from "react-spinners";
const CreatedApplications = () => {
  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
  }, []);

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="flex flex-col gap-2">
      {applications?.map((application) => {
        return (
          <Applicationcart
            key={application.id}
            application={application}
            isCandidate={true}
          />
        );
      })}
    </div>
  )
}

export default CreatedApplications
