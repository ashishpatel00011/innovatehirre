import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import { MapPinIcon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getSingleJob, updateHiringStatus } from '@/api/apijobs';
import useFetch from '@/hooks/use_fatch';
import { Briefcase, DoorOpen, DoorClosed } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import ApplyJob from '@/components/applyjob';
import Applicationcart from '@/components/applicationcart';
const Job = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();
  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const {
    loading: loadingHiringStatus,
    fn: fnHiringStatus,
  } = useFetch(updateHiringStatus, {
    job_id: id,
  });

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <article className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse items-center justify-between gap-6 md:flex-row">
        <h1 className="pb-3 text-4xl font-extrabold gradient-title sm:text-6xl">
          {job?.title || 'Job Title Not Available'}
        </h1>
        {job?.company?.logo_url ? (
          <img src={job?.company?.logo_url} className="h-12" alt={`${job?.company?.name} Logo`} />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full" aria-label="No company logo available" />
        )}
      </div>

      <div className="flex justify-between ">
        <div className="flex items-center gap-2">
          <MapPinIcon /> {job?.location || 'Location not specified'}
        </div>
        <div className="flex items-center gap-2">
          <Briefcase /> {job?.applications?.length || 0} Applicants
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>

      </div>
      {/* {!loadingHiringStatus &&<BarLoader  width={"100%"} color="#36d7b7" />} */}
      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}
          >
            <SelectValue
              placeholder={
                "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}


      <h2 className="text-2xl font-bold sm:text-3xl">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>

      <h2 className="text-2xl font-bold sm:text-3xl">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={
          job?.requirements
            ? job?.requirements.split('\n').map(req => `- ${req}`).join('\n')
            : 'No requirements specified.'
        }
        className="bg-transparent sm:text-lg"
      />
      {job?.recruiter_id !== user?.id && (
        <ApplyJob
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="mb-4 ml-1 text-xl font-bold">Applications</h2>
          {job?.applications.map((application) => {
            return (
              <Applicationcart key={application.id} application={application} />
            );
          })}
        </div>
      )}
    </article>
  );
}

export default Job;
