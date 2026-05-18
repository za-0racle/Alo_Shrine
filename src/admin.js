import { supabase } from "../Lib/supabaseClient.js";

export const oracleActions = {
  getPendingSubmissions: async () => {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error || !posts?.length) {
      return { data: posts || [], error };
    }

    const authorIds = [...new Set(posts.map((post) => post.author_id).filter(Boolean))];

    if (!authorIds.length) {
      return { data: posts, error: null };
    }

    const { data: profiles = [], error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", authorIds);

    if (profilesError) {
      console.error("Error fetching oracle author profiles:", {
        message: profilesError.message,
        details: profilesError.details,
        hint: profilesError.hint,
        code: profilesError.code,
      });
    }

    const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
    const postsWithProfiles = posts.map((post) => ({
      ...post,
      profiles: profilesById.get(post.author_id) || null,
    }));

    return { data: postsWithProfiles, error: null };
  },

  updateStatus: async (postId, newStatus) => {
    const { data, error } = await supabase.from("posts").update({ status: newStatus }).eq("id", postId);

    return { data, error };
  },

  toggleFeatured: async (postId, isFeatured) => {
    const status = isFeatured ? "featured" : "published";
    const { data, error } = await supabase.from("posts").update({ status }).eq("id", postId);

    return { data, error };
  },
};
