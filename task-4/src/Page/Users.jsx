import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getUsers } from "../services/getUsersApi";
import { formatTimestamp } from "../utils/helpers";
import supabase from "../config/supabaseConfig";
import useCurrentUser from "../useCurrentUser";
import Loading from "../ui/Loading";

const Users = () => {
  const queryClient = useQueryClient();
  const loggedInUser = useCurrentUser();
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { mutate: deleteUsers, isLoading: isDeletingUsers } = useMutation({
    mutationFn: async () => {
      await Promise.all([
        ...selectedUsers.map((user) =>
          supabase.auth.admin.deleteUser(user.auth_id, true)
        ),
        supabase
          .from("users")
          .update({ is_deleted: true })
          .in(
            "id",
            selectedUsers.map((user) => user.id)
          ),
      ]);
    },
  });

  const handleCheckboxChange = (user) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.some((u) => u.id === user.id)) {
        return prevSelectedUsers.filter((u) => u.id !== user.id);
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  };

  const handleBlockUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ status: "Blocked" })
        .in(
          "id",
          selectedUsers.map((user) => user.id)
        );

      if (error) throw error;
      console.log("Blocked users:", data);
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error blocking users:", error.message);
    }
  };

  const handleUnlockUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ status: "Active" })
        .in(
          "id",
          selectedUsers.map((user) => user.id)
        );

      if (error) throw error;
      console.log("Unlocked users:", data);
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error unlocking users:", error.message);
    }
  };

  const handleDeleteUsers = async () => {
    deleteUsers(
      selectedUsers.map((user) => user.id),
      {
        onSuccess(data) {
          console.log("delete users susccess", data);
          queryClient.invalidateQueries({
            queryKey: ["users"],
          });
        },
        onError(error) {
          console.log("delete users error", error);
        },
      }
    );
  };

  if (isLoading) return <p>Loading....</p>;

  const filteredUsers =
    data?.map((u) => ({
      ...u,
      isCurrent: u.auth_id === loggedInUser?.auth_id,
    })) ?? [];

  return (
    <div>
      <div className="sticky px-5 py-6 bg-blue-200 w-screen h-[40px] flex justify-end items-center gap-6">
        <div>
          Hello,
          <span className="text-blue-500">
            {isLoading ? <Loading /> : loggedInUser?.name}
          </span>
        </div>
        <button
          className="text-blue-500"
          onClick={() => {
            supabase.auth.signOut();
          }}
        >
          Logout
        </button>
      </div>
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">User Registry</h1>
          <div className="flex items-center space-x-2">
            <button
              className="bg-gray-300 p-2 rounded hover:bg-gray-400"
              onClick={handleBlockUsers}
              disabled={selectedUsers.length === 0}
            >
              Block
            </button>
            <button
              className="bg-gray-300 p-2 rounded hover:bg-gray-400"
              onClick={handleUnlockUsers}
              disabled={selectedUsers.length === 0}
            >
              Unlock
            </button>
            <button
              className="bg-red-400 p-2 rounded hover:bg-red-500"
              onClick={handleDeleteUsers}
              disabled={selectedUsers.length === 0 || isDeletingUsers}
            >
              Delete
            </button>
          </div>
        </div>

        {/* User Table */}
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(
                        data.filter((u) => u.auth_id !== loggedInUser?.auth_id)
                      ); // Select all users
                    } else {
                      setSelectedUsers([]); // Deselect all users
                    }
                  }}
                  checked={selectedUsers.length === data?.length - 1}
                />
              </th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Position</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Last Login</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">
                  <input
                    disabled={user.isCurrent}
                    type="checkbox"
                    onChange={() => handleCheckboxChange(user)}
                    checked={selectedUsers.some((u) => u.id === user.id)}
                  />
                </td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.position}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{formatTimestamp(user.last_login)}</td>
                <td
                  className={`p-2 ${
                    user.status === "Blocked"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {user.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
