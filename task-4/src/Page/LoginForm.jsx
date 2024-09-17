import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import supabase from "../config/supabaseConfig";

async function signInWithEmail(data) {
  const mail = data.email;

  async function searchByIdAndStatus(email) {
    email = mail;
    const { data: userInfo, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("is_deleted", false)
      .limit(1)
      .single();

    if (!userInfo) {
      throw new Error("User not found or inactive");
    }
    const user = userInfo;
    if (user.status === "Blocked") {
      throw new Error("User is blocked");
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      throw new Error("Invalid credentials");
    }
    const { error: updateError } = await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", user.id);

    if (updateError) {
      throw new Error("Failed to update last login time");
    }
  }

  await searchByIdAndStatus(mail);
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    try {
      await signInWithEmail(data);
      navigate("/users");
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
      <div className="flex flex-col justify-between items-start w-[400px] bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

        {/* Display error message */}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <form
          className="flex flex-col w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Email Field */}
          <label htmlFor="email" className="mb-2 text-gray-700">
            Email
          </label>
          <input
            type="text"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
            })}
            className="mb-1 p-2 border border-gray-300 rounded w-full"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-4">{errors.email.message}</p>
          )}

          {/* Password Field */}
          <label htmlFor="password" className="mb-2 text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Password is required" })}
            className="mb-1 p-2 border border-gray-300 rounded w-full"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-4">
              {errors.password.message}
            </p>
          )}

          {/* Submit Button */}
          <button className="w-full mt-6 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          New user?{" "}
          <button
            className="text-blue-500 hover:underline ml-4"
            onClick={() => navigate("/registration")}
          >
            Register here &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
