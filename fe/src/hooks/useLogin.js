import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 🧠 System Design: Changed 'username' to 'email' to match backend schema
export default function useLogin(email, password, form, toggleForm ) {
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Backend Expects: { email, password }
			const response = await authAPI.login(email, password);
			
			// 🔐 Auth Management: Store the JWT and User info in Context
			login(response.token, response.user);
			
			toast.success("Login successful, Welcome back!", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: false,
				draggable: true,
			});

			if (form) toggleForm();
			
			navigate("/dashboard");
		} catch (err) {
			setError(err.response?.data?.error || "Login failed. Please check your credentials.");
		} finally {
			setLoading(false);
		}
	};

	return { handleSubmit, loading, error };
}
