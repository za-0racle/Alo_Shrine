import { supabase } from '../Lib/supabaseClient.js'

let currentUserPromise = null;
let currentUserCache = null;

const getAccountType = (user) => (user.user_metadata?.account_type === 'writer' ? 'writer' : 'reader');

const getStarterProfile = (user) => ({
    id: user.id,
    full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New member',
    username: user.user_metadata?.username || user.email?.split('@')[0] || user.id,
    role: getAccountType(user),
    writer_level: getAccountType(user) === 'writer' ? 'Novice Scribe' : 'The Listener',
});

const fetchProfile = async (user) => {
    const { data: profile, error } = await supabase.from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    if (!error) return { profile, error: null };

    console.error("Error fetching profile:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
    });

    return { profile: null, error };
};

const ensureProfile = async (user) => {
    if (!user) return null;

    const { profile, error: fetchError } = await fetchProfile(user);
    if (profile) return profile;
    if (fetchError) return null;

    const { data: insertedProfile, error } = await supabase.from('profiles')
        .upsert(getStarterProfile(user), { onConflict: 'id' })
        .select('*')
        .maybeSingle();

    if (error) {
        console.error("Error creating profile:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
        });
        return null;
    }

    return insertedProfile;
};

// Supabase auth helpers used by the app UI.
export const authActions = {
    // Create a new account and store starter profile metadata.
    signUp: async (email, password, fullName, accountType = 'reader') => {
        const role = accountType === 'writer' ? 'writer' : 'reader';

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    username: email.split('@')[0],
                    account_type: role,
                    role,
                    writer_level: role === 'writer' ? 'Novice Scribe' : 'The Listener',
                }
            }
        });
        if (error) throw error;

        currentUserCache = null;
        currentUserPromise = null;

        if (data.session && data.user) {
            const profile = await ensureProfile(data.user);
            currentUserCache = { ...data.user, profile };
        }

        return data;
    },

    // Sign an existing writer in with email and password.
    signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        currentUserCache = null;
        currentUserPromise = null;

        if (data.user) {
            const profile = await ensureProfile(data.user);
            currentUserCache = { ...data.user, profile };
        }

        return data;
    },

    // Sign the current writer out and refresh the UI.
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        currentUserCache = null;
        currentUserPromise = null;
    },

    // Return the logged-in user together with their latest public profile row.
    getCurrentUser: async () => {
        if (currentUserCache) return currentUserCache;
        if (currentUserPromise) return currentUserPromise;

        currentUserPromise = (async () => {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError || !user) return null;

            const profile = await ensureProfile(user);

            currentUserCache = { ...user, profile };
            return currentUserCache;
        })();

        const userObject = await currentUserPromise;
        currentUserPromise = null;
        return userObject;
    },

    refreshCurrentUser: async () => {
        currentUserCache = null;
        currentUserPromise = null;
        return authActions.getCurrentUser();
    },

    updatePassword: async (password) => {
        const { data, error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        return data;
    },

    sendPasswordReset: async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        if (error) throw error;
        return data;
    }
};
