import React from "react";
import supabase from "./config/supabaseConfig";

const useCurrentUser = () => {
  const [loggedInUser, setLoggedInUser] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from("users")
          .select()
          .eq("email", session.user.email)
          .limit(1)
          .single()
          .then((res) => {
            if (res.data) {
              setLoggedInUser({
                id: res.data.id,
                auth_id: session.user.id,
                email: session.user.email,
                name: res.data.name,
              });
            }
          });
      } else {
        setLoggedInUser(null);
      }
    });

    const unsubscribe = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) {
        setLoggedInUser(null);
      } else {
        supabase
          .from("users")
          .select()
          .eq("email", session.user.email)
          .limit(1)
          .single()
          .then((res) => {
            if (res.data) {
              setLoggedInUser({
                id: res.data.id,
                auth_id: session.user.id,
                email: session.user.email,
                name: res.data.name,
              });
            }
          });
      }
    });

    return unsubscribe.data.subscription.unsubscribe;
  }, []);

  return loggedInUser;
};

export default useCurrentUser;
