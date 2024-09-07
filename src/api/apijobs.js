import SupabaseClient from "@/utils/superbase";

export async function getJobs(
  token,
  { location, company_id, searchQuery, page = 1, limit = 9 }
) {
  const supabase = await SupabaseClient(token);

  // Calculate the starting index and ending index for the current page
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let query = supabase
    .from("jobs")
    .select("*, saved: saved_jobs(id), company: companies(name,logo_url)")
    .order("created_at", { ascending: false }); // Order by created_at or id in descending order

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  // Apply pagination using the range() method
  query = query.range(start, end);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}
export async function getSavedJobs(token) {
  const supabase = await SupabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))");
  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }
  return data;
}
export async function getSingleJob(token, { job_id }) {
  try {
    const supabase = await SupabaseClient(token);

    let query = supabase
      .from("jobs")
      .select(
        "*, company: companies(name,logo_url), applications: applications(*)"
      )
      .eq("id", job_id)
      .single(); // Assumes there's only one job with this ID.

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching job: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in getSingleJob:", error);
    return null;
  }
}
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await SupabaseClient(token);
  const { user_id, job_id } = saveData;

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("user_id", user_id)
      .eq("job_id", job_id);

    if (deleteError) {
      console.error("Error removing saved job:", deleteError.message);
      return { success: false, message: "Failed to remove job" };
    }

    return { success: true, data };
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert({ user_id, job_id })
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError.message);
      return { success: false, message: "Failed to save job" };
    }

    return { success: true, data };
  }
}
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await SupabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await SupabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }
  return data;
}
export async function createJob(token, jobData) {
  try {
    const supabase = await SupabaseClient(token);
    let query = supabase
      .from("jobs")
      .insert([
        {
          title: jobData.title,
          description: jobData.description,
          isOpen: true, // Default to 'open' when the job is created
          recruiter_id: jobData.recruiter_id,
          // other fields...
        },
      ])
      .select();

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error creating job: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error in createJob:", error);
    return null;
  }
}
export async function deleteJob(token, { job_id }) {
  try {
    const supabase = await SupabaseClient(token);

    const { data, error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", job_id)
      .select();

    if (error) {
      console.error("Error deleting job:", error.message);
      return { success: false, message: "Failed to delete job" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return { success: false, message: "An unexpected error occurred" };
  }
}

export async function addNewJob(token, _, jobData) {
  const supabase = await SupabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Job");
  }

  return data;
}
