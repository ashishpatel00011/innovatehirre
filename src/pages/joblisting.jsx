import { getJobs } from '@/api/apijobs';
import useFetch from '@/hooks/use_fatch';
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useUser } from '@clerk/clerk-react';
import { BarLoader } from 'react-spinners';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Jobcart from '@/components/job_cart';
import { getCompanies } from '@/api/apicompanies';
import { State } from 'country-state-city';

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [company_id, setCompany_id] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0); // New state for total jobs
  const jobsPerPage = 9; // Number of jobs per page
  const { isLoaded } = useUser();

  const {
    loading: loadingJobs,
    data: jobsData,
    fn: fnJobs,
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
    page: currentPage,
    limit: jobsPerPage,
  });

  const {
    data: companies,
    fn: fnCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      fnJobs().then((data) => {
        setTotalJobs(data?.total || 0); // Update totalJobs based on the data returned
      });
    }
  }, [isLoaded, location, company_id, searchQuery, currentPage]);

  const totalPages = Math.ceil(totalJobs / jobsPerPage); // Calculate total pages

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search-query');
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCompany_id('');
    setLocation('');
    setCurrentPage(1); // Reset to the first page when clearing filters
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={'100%'} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="pb-8 text-6xl font-extrabold text-center gradient-title sm:text-7xl">Latest Jobs</h1>

      <form onSubmit={handleSearch} className="flex flex-row items-center w-full gap-2 mb-3 h-14">
        <Input type="text" placeholder="Search Jobs by Title.." name="search-query" className="flex-1 h-full px-4 text-md" />
        <Button type="submit" className="h-full sm:w-28" variant="blue">Search</Button>
      </form>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry('IN').map(({ name }) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={company_id} onValueChange={(value) => setCompany_id(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => (
                <SelectItem key={name} value={id}>{name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button className="sm:w-1/2" variant="destructive" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {loadingJobs ? (
        <BarLoader className="mt-4" width={'100%'} color="#36d7b7" />
      ) : (
        <>
          <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
            {jobsData?.length ? (
              jobsData.map((job) => (
                <Jobcart key={job.id} job={job} savedInit={job?.saved?.length > 0} />
              ))
            ) : (
              <div>No Jobs Found 😢</div>
            )}
          </div>

          <Pagination className="mt-8">
            <PaginationContent className="flex items-center justify-center gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {/* Display current page and total pages */}
              <span className="font-medium text-md">{`Page ${currentPage} of ${totalPages}`}</span>

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => jobsData?.length > 0 && handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default JobListing;
