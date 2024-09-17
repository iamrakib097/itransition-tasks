import { useForm } from "react-hook-form";
import supabase from "../config/supabaseConfig"; // Adjust the path if necessary
import { useState } from "react";

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // For confirmation message
  const password = watch("password");

  async function onSubmit(data) {
    try {
      const { name, email, password, position } = data;

      // Sign up the user with Supabase Auth and request email confirmation
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        throw new Error(signUpError.message || "Error during sign-up.");
      }

      // Show a success message to notify the user to check their email for confirmation
      setSuccessMessage(
        "Registration successful! Please check your email to confirm your account."
      );

      const { data: deletedUserInfo } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("is_deleted", true)
        .limit(1)
        .single();

      if (deletedUserInfo) {
        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update([
            {
              is_deleted: false,
            },
          ])
          .eq("id", deletedUserInfo.id)
          .single();

        if (updateError) {
          console.error("Insert Error:", updateError); // Log the full error
          throw new Error(`Error updating delted user: ${updateError.message}`);
        }

        console.log("User registered successfully:", updatedUser);
      } else {
        // Insert user details into the 'users' table (optional)
        // You can also choose to insert user data after they confirm their email.
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              name, // Insert name
              email,
              role: "admin",
              position, // Add position to the table if required
              last_login: null, // Initially set to null
              status: "Active",
              registration_time: new Date(), // Default is handled by the database
            },
          ])
          .single();

        if (insertError) {
          console.error("Insert Error:", insertError); // Log the full error
          throw new Error(`Error inserting new user: ${insertError.message}`);
        }

        console.log("User registered successfully:", newUser);
      }
    } catch (error) {
      setErrorMessage(error.message); // Set error message if registration fails
    }
  }

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
      <div className="flex flex-col justify-between items-start w-[400px] bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign up</h2>
        {/* Display success message */}
        {successMessage && (
          <p className="text-green-500 mb-4">{successMessage}</p>
        )}
        {/* Display error message */}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <form
          className="flex flex-col w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Full Name Field */}
          <label htmlFor="name" className="mb-2 text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Full name is required" })}
            className="mb-1 p-2 border border-gray-300 rounded w-full"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mb-4">{errors.name.message}</p>
          )}

          {/* Email Field */}
          <label htmlFor="email" className="mb-2 text-gray-700">
            Email
          </label>
          <input
            type="email"
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

          {/* Position Field */}
          <label htmlFor="position" className="mb-2 text-gray-700">
            Position
          </label>
          <input
            type="text"
            id="position"
            {...register("position")}
            className="mb-1 p-2 border border-gray-300 rounded w-full"
            placeholder="Enter your position"
          />

          {/* Password Field */}
          <label htmlFor="password" className="mb-2 text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            className="mb-1 p-2 border border-gray-300 rounded w-full"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mb-4">
              {errors.password.message}
            </p>
          )}

          {/* Confirm Password Field */}
          <label htmlFor="repassword" className="mb-2 text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="repassword"
            {...register("repassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className="mb-1 p-2 border border-gray-300 rounded w-full"
            placeholder="Confirm your password"
          />
          {errors.repassword && (
            <p className="text-red-500 text-sm mb-6">
              {errors.repassword.message}
            </p>
          )}

          {/* Submit Button */}
          <button className="w-full bg-blue-500 text-white py-2 mt-6 rounded hover:bg-blue-600 transition duration-300">
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600 ">
          Have an account?
          <button className="text-blue-500 hover:underline ml-4">
            Login here &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
