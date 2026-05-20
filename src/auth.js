import { supabase } from '../Lib/supabaseClient.js'

let currentUserPromise = null;
let currentUserCache = null;
let sessionGuardInitialized = false;
let sessionActivityTimer = null;

const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_MAX_LIFETIME_MS = 12 * 60 * 60 * 1000;
const SESSION_STARTED_AT_KEY = "alo_session_started_at";
const SESSION_LAST_ACTIVITY_KEY = "alo_session_last_activity_at";

const now = () => Date.now();

const readStamp = (key) => {
    try {
        const value = Number(window.sessionStorage.getItem(key));
        return Number.isFinite(value) && value > 0 ? value : null;
    } catch {
        return null;
    }
};

const writeStamp = (key, value = now()) => {
    try {
        window.sessionStorage.setItem(key, String(value));
    } catch {
        // Ignore storage write failures.
    }
};

const clearSessionStamps = () => {
    try {
        window.sessionStorage.removeItem(SESSION_STARTED_AT_KEY);
        window.sessionStorage.removeItem(SESSION_LAST_ACTIVITY_KEY);
    } catch {
        // Ignore storage cleanup failures.
    }
};

const stampSessionStartIfMissing = () => {
    if (!readStamp(SESSION_STARTED_AT_KEY)) {
        writeStamp(SESSION_STARTED_AT_KEY);
    }
    writeStamp(SESSION_LAST_ACTIVITY_KEY);
};

const isSessionPastSupabaseExpiry = (session) => {
    const expiresAtMs = Number(session?.expires_at || 0) * 1000;
    return Boolean(expiresAtMs && now() >= expiresAtMs);
};

const isSessionPastMaxLifetime = () => {
    const startedAt = readStamp(SESSION_STARTED_AT_KEY);
    if (!startedAt) return false;
    return now() - startedAt >= SESSION_MAX_LIFETIME_MS;
};

const isSessionIdleTooLong = () => {
    const lastActivityAt = readStamp(SESSION_LAST_ACTIVITY_KEY);
    if (!lastActivityAt) return false;
    return now() - lastActivityAt >= SESSION_IDLE_TIMEOUT_MS;
};

const touchSessionActivity = () => {
    if (!currentUserCache) return;
    writeStamp(SESSION_LAST_ACTIVITY_KEY);
    scheduleSessionActivityCheck();
};

const scheduleSessionActivityCheck = () => {
    if (sessionActivityTimer) window.clearTimeout(sessionActivityTimer);
    const lastActivityAt = readStamp(SESSION_LAST_ACTIVITY_KEY) || now();
    const dueIn = Math.max(3000, SESSION_IDLE_TIMEOUT_MS - (now() - lastActivityAt));
    sessionActivityTimer = window.setTimeout(async () => {
        if (!isSessionIdleTooLong()) {
            scheduleSessionActivityCheck();
            return;
        }
        try {
            await authActions.signOut();
        } catch (error) {
            console.error("Error during automatic logout:", error);
        }
    }, dueIn);
};

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
            stampSessionStartIfMissing();
            scheduleSessionActivityCheck();
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
            stampSessionStartIfMissing();
            scheduleSessionActivityCheck();
        }

        return data;
    },

    // Sign the current writer out and refresh the UI.
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        currentUserCache = null;
        currentUserPromise = null;
        if (sessionActivityTimer) {
            window.clearTimeout(sessionActivityTimer);
            sessionActivityTimer = null;
        }
        clearSessionStamps();
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
            stampSessionStartIfMissing();
            scheduleSessionActivityCheck();
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

    initializeSessionGuard: async () => {
        if (sessionGuardInitialized) return;
        sessionGuardInitialized = true;

        const activityEvents = ["click", "keydown", "mousemove", "touchstart", "scroll"];
        activityEvents.forEach((eventName) => {
            window.addEventListener(eventName, touchSessionActivity, { passive: true });
        });

        supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_OUT") {
                currentUserCache = null;
                currentUserPromise = null;
                clearSessionStamps();
                if (sessionActivityTimer) {
                    window.clearTimeout(sessionActivityTimer);
                    sessionActivityTimer = null;
                }
                return;
            }

            if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
                if (session?.user) {
                    stampSessionStartIfMissing();
                    scheduleSessionActivityCheck();
                }
            }
        });
    },

    enforceSessionPolicy: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            clearSessionStamps();
            return null;
        }

        stampSessionStartIfMissing();

        if (isSessionPastSupabaseExpiry(session) || isSessionPastMaxLifetime() || isSessionIdleTooLong()) {
            await authActions.signOut();
            return null;
        }

        return session;
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
