import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getUsers } from "../services/getUsersApi";
import { formatTimestamp } from "../utils/helpers";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import supabase from "../config/supabaseConfig";
import useCurrentUser from "../useCurrentUser";
import Loading from "../ui/Loading";
import block from "../assets/block.svg";
import unblock from "../assets/unblock.svg";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const loggedInUser = useCurrentUser();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { mutate: deleteUsers, isLoading: isDeletingUsers } = useMutation({
    mutationFn: async () => {
      if (
        selectedUsers.some((user) => user.auth_id === loggedInUser?.auth_id)
      ) {
        await supabase.auth.signOut();

        await new Promise((resolve) => setTimeout(resolve, 1000));

        await supabase
          .from("users")
          .update({ is_deleted: true })
          .in(
            "id",
            selectedUsers.map((user) => user.id)
          );
      } else {
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
      }
    },
    onSuccess: () => {
      // Redirect to login after successful deletion
      navigate("/login");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedUsers([]);
    },
    onError: (error) => {
      console.error("Delete users error:", error);
    },
  });

  const { mutate: blockUsers, isLoading: isBlocking } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("users")
        .update({ status: "Blocked" })
        .in(
          "id",
          selectedUsers.map((user) => user.id)
        );
      if (error) throw error;
    },
    onSuccess: () => {
      if (
        selectedUsers.some((user) => user.auth_id === loggedInUser?.auth_id)
      ) {
        supabase.auth.signOut().then(() => navigate("/login")); // Redirect to login page
      }
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedUsers([]);
    },
    onError: (error) => {
      console.error("Block users error:", error);
    },
  });

  const { mutate: unblockingUsers, isLoading: isUnblocking } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("users")
        .update({ status: "Active" })
        .in(
          "id",
          selectedUsers.map((user) => user.id)
        );
      if (error) throw error;
    },
    onSuccess: () => {
      if (
        selectedUsers.some((user) => user.auth_id === loggedInUser?.auth_id)
      ) {
        supabase.auth.signOut().then(() => navigate("/login")); // Redirect to login page
      }
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedUsers([]);
    },
    onError: (error) => {
      console.error("Unblock users error:", error);
    },
  });

  const handleCheckboxChange = (user) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.some((u) => u.id === user.id)
        ? prevSelectedUsers.filter((u) => u.id !== user.id)
        : [...prevSelectedUsers, user]
    );
  };

  const handleBlockUsers = () => {
    blockUsers();
  };

  const handleUnlockUsers = () => {
    unblockingUsers();
  };

  const handleDeleteUsers = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteUsers();
  };

  const handleSignOut = () => {
    supabase.auth.signOut().then(() => navigate("/login")); // Redirect to login page
  };

  useEffect(() => {
    if (loggedInUser) {
      const currentUserStatus = data?.find(
        (user) => user.auth_id === loggedInUser.auth_id
      );
      if (
        currentUserStatus &&
        (currentUserStatus.status === "Blocked" || currentUserStatus.is_deleted)
      ) {
        supabase.auth.signOut().then(() => navigate("/login"));
      }
    }
  }, [data, loggedInUser, navigate]);

  if (isLoading) return <Loading />;
  if (isBlocking || isDeletingUsers || isUnblocking) return <p>Loading...</p>;

  const filteredUsers =
    data?.map((u) => ({
      ...u,
      isCurrent: u.auth_id === loggedInUser?.auth_id,
    })) ?? [];

  return (
    <div>
      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={isDeletingUsers}
        />
      )}

      <div className="sticky top-0 px-5 py-4 bg-gray-900 w-full flex justify-between items-center shadow-md z-50">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-gray-300">Welcome,</span>
          <span className="text-lg font-semibold text-white">
            {loggedInUser?.name}
          </span>
        </div>
        <button
          className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-md inline-flex justify-center items-center"
          onClick={handleSignOut}
        >
          Logout
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">User Registry</h1>
          <div className="flex items-center space-x-4">
            <button
              className="bg-gray-300 p-2 rounded hover:bg-gray-100 flex gap-2 active:scale-90 transition-all duration-300 ease-in-out transform"
              onClick={handleBlockUsers}
              disabled={
                selectedUsers.length === 0
                // selectedUsers.some((user) => user.isCurrent)
              }
            >
              <img src={block} alt="Block" width={24} height={24} />
              Block
            </button>
            <button
              className="bg-gray-300 p-2 rounded hover:bg-gray-100 flex gap-2 active:scale-90 transition-all duration-300 ease-in-out transform"
              onClick={handleUnlockUsers}
              disabled={selectedUsers.length === 0}
            >
              <img src={unblock} alt="Unblock" width={24} height={24} />
              Unblock
            </button>
            <button
              className="bg-red-400 p-2 rounded hover:bg-red-100 active:scale-90 transition-all duration-300 ease-in-out transform"
              onClick={handleDeleteUsers}
              disabled={
                selectedUsers.length === 0
                // selectedUsers.some((user) => user.isCurrent)
              }
            >
              Delete
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(
                          data.filter(
                            (u) =>
                              u.auth_id !== loggedInUser?.auth_id ||
                              u.auth_id === loggedInUser?.auth_id
                          )
                        );
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    checked={selectedUsers.length === data?.length}
                  />
                </th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Position</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Last Login</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-all"
                >
                  <td className="p-4">
                    <input
                      // disabled={user.isCurrent}
                      type="checkbox"
                      onChange={() => handleCheckboxChange(user)}
                      checked={selectedUsers.some((u) => u.id === user.id)}
                    />
                  </td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.position ? user.position : "-"}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{formatTimestamp(user.last_login)}</td>
                  <td
                    className={`p-4 font-semibold ${
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
    </div>
  );
};

export default Users;
