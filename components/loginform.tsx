"use client";

import { useState } from "react";
import { Login } from "../actions/auth"; // Adjust the import path as necessary

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault(); // Prevent form submission

		try {
			const result = await Login({ email, password });
			if (!result) {
				setError("Login failed. Please check your credentials.");
			}
		} catch (error) {
			setError("An error occurred during login.");
			console.error("Login error: ", error);
		}
	};

	return (
		<div className="font-bold grid grid-cols-1 sm:grid-cols-2 h-screen bg-gray-400 ">
			<section className="space-y-6 bg-slate-700 h-screen sm:h-full flex flex-col justify-center p-6 ">
				<h2 className="font-extrabold text-5xl">
					Log in <br /> to Your Cabinet
				</h2>
				<p>
					Cabinet stayed closed while you were away, login to gain
					access once more.
				</p>
			</section>
			<section className="h-screen sm:h-full flex justify-center items-center bg-black p-6">
				<form
					className="flex items-center justify-center w-full h-full"
					onSubmit={handleLogin}>
					<div className="flex flex-col w-full m-5 space-y-12 ">
						{error && <p className="text-red-500">{error}</p>}
						<div className="space-y-6">
							<div className="flex flex-col gap-y-2">
								<label className="text-lg" htmlFor="email">
									EMAIL
								</label>
								<input
									className="ring-2 ring-slate-600 rounded-lg text-black p-3"
									type="email"
									name="email"
									id="email"
									value={email} // Bind the input value to state
									onChange={(e) => setEmail(e.target.value)} // Update state on change
									required
								/>
							</div>
							<div className="flex flex-col gap-y-2">
								<label className="text-lg" htmlFor="password">
									PASSWORD
								</label>
								<input
									className="ring-2 ring-slate-600 rounded-lg text-black p-3"
									type="password"
									name="password"
									id="password"
									value={password} // Bind the input value to state
									onChange={(e) => setPassword(e.target.value)} // Update state on change
									required
								/>
							</div>
						</div>
						<button
							type="submit"
							className="mt-4 bg-slate-700 text-white rounded-lg p-2">
							Login
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}
