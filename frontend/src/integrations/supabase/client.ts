// This file is customized to mock Supabase and run 100% locally.
// This completely avoids any network dependencies or external connection errors.

const guestUser = {
  id: "guest-user-12345",
  email: "guest@truthlens.local",
  user_metadata: {
    first_name: "Guest",
    last_name: "User"
  }
};

// LocalStorage database mocking for profiles and saved checks
const getLocalStorageData = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

const setLocalStorageData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
};

// Initialize default profile and saved checks in localStorage if not exists
if (!getLocalStorageData("truthlens_profile")) {
  setLocalStorageData("truthlens_profile", {
    user_id: guestUser.id,
    first_name: "Guest",
    last_name: "User",
    bio: "Fact checker enthusiast"
  });
}
if (!getLocalStorageData("truthlens_saved_checks")) {
  setLocalStorageData("truthlens_saved_checks", []);
}

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: { user: guestUser } }, error: null }),
    getUser: async () => ({ data: { user: guestUser }, error: null }),
    onAuthStateChange: (callback: any) => {
      // Trigger the signed-in callback immediately for the guest user
      setTimeout(() => {
        callback("SIGNED_IN", { user: guestUser });
      }, 0);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: async () => ({ data: { user: guestUser, session: { user: guestUser } }, error: null }),
    signUp: async () => ({ data: { user: guestUser, session: { user: guestUser } }, error: null }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: null }),
  },
  from: (table: string) => {
    return {
      select: (fields: string = "*") => {
        return {
          eq: (field: string, value: any) => {
            return {
              maybeSingle: async () => {
                if (table === "profiles") {
                  return { data: getLocalStorageData("truthlens_profile"), error: null };
                }
                return { data: null, error: null };
              },
              single: async () => {
                if (table === "profiles") {
                  return { data: getLocalStorageData("truthlens_profile"), error: null };
                }
                return { data: null, error: null };
              },
              order: (orderField: string, options: any) => {
                const data = getLocalStorageData("truthlens_saved_checks") || [];
                return {
                  then: (cb: any) => cb({ data, error: null })
                };
              },
              then: (cb: any) => {
                const data = getLocalStorageData("truthlens_saved_checks") || [];
                cb({ data, error: null });
              }
            };
          },
          order: (orderField: string, options: any) => {
            const data = getLocalStorageData("truthlens_saved_checks") || [];
            return {
              then: (cb: any) => cb({ data, error: null })
            };
          },
          then: (cb: any) => {
            const data = getLocalStorageData("truthlens_saved_checks") || [];
            cb({ data, error: null });
          }
        };
      },
      insert: (items: any) => {
        const list = getLocalStorageData("truthlens_saved_checks") || [];
        const newItems = Array.isArray(items) ? items : [items];
        const added = newItems.map(item => ({
          id: Math.random().toString(36).substring(7),
          created_at: new Date().toISOString(),
          ...item
        }));
        setLocalStorageData("truthlens_saved_checks", [...added, ...list]);
        return {
          select: () => ({
            single: async () => ({ data: added[0], error: null })
          })
        };
      },
      update: (updatedFields: any) => {
        return {
          eq: (field: string, value: any) => {
            if (table === "profiles") {
              const current = getLocalStorageData("truthlens_profile") || {};
              const merged = { ...current, ...updatedFields };
              setLocalStorageData("truthlens_profile", merged);
            }
            return {
              then: (cb: any) => cb({ data: null, error: null })
            };
          }
        };
      },
      delete: () => {
        return {
          eq: (field: string, value: any) => {
            if (table === "saved_fact_checks") {
              const list = getLocalStorageData("truthlens_saved_checks") || [];
              const filtered = list.filter((item: any) => item[field] !== value);
              setLocalStorageData("truthlens_saved_checks", filtered);
            }
            return {
              then: (cb: any) => cb({ data: null, error: null })
            };
          }
        };
      }
    };
  }
} as any;