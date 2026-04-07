import { authAPI } from "../services/api";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useSignUp(email, password, confirmPassword) {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// 🛡️ Frontend Validation (Performance: Prevents unnecessary API calls)
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		setLoading(true);

		try {
			// Backend expects { email, password }
			await authAPI.register(email, password);
			
			toast.success("Account created! Please login.", {
				position: "top-right",
				autoClose: 3000,
			});
			
			navigate("/login");
		} catch (err) {
			// 🧠 System Design: Catching specific Postgres unique constraint errors
			setError(err.response?.data?.error || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return { handleSubmit, loading, error };
}
