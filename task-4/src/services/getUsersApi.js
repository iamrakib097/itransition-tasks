import supabase from "../config/supabaseConfig";

export async function getUsers() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("is_deleted", false);

  if (error) {
    console.error(error);
    throw new Error("Users could not be loaded");
  }

  const {
    data: { users },
  } = await supabase.auth.admin.listUsers();

  return data.map((user) => {
    const authInfo = users.find((authU) => authU.email === user.email);

    return {
      ...user,
      auth_id: authInfo?.id,
    };
  });
}
