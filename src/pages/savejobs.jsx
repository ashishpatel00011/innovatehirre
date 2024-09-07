import React from 'react'
import { getSavedJobs } from '@/api/apijobs'
import { useUser } from '@clerk/clerk-react';
import useFetch from '@/hooks/use_fatch';
import { BarLoader } from 'react-spinners';
import { useEffect } from 'react';
import Jobcart from '@/components/job_cart';
const SaveJobes = () => {
const{isLoaded}=useUser()
  const {
    loading: loadingSavedJobs,
    data: SavedJobs,
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);
  useEffect(() => {
    if (isLoaded) fnSavedJobs();
  }, [isLoaded]);

  if (!isLoaded|| loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }
  return (
    <div>
    <h1 className="pb-8 text-6xl font-extrabold text-center gradient-title sm:text-7xl">
      Saved Jobs
    </h1>

    {loadingSavedJobs === false && (
      <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
        {SavedJobs?.length ? (
          SavedJobs?.map((saved) => {
            return (
              <Jobcart
                key={saved.id}
                job={saved?.job}
                onJobAction={fnSavedJobs}
                savedInit={true}
              />
            );
          })
        ) : (
          <div>No Saved Jobs 👀</div>
        )}
      </div>
    )}
  </div>
  )
}

export default SaveJobes
