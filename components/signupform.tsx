'use client';

import { useState } from "react";
import { Signup } from "@/actions/auth";

export default function SignupForm() {
	const [error, setError] = useState<string | null>(null);

	const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const username = formData.get("username") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			await Signup({ username, email, password });
		} catch (error) {
			setError(error + 'something unexpected occured');
		}
	};

	return (
		<div className="grid grid-cols-2 h-screen bg-gray-400 ">
			<section className="space-y-6 bg-slate-700 h-full flex flex-col justify-center p-6 ">
				<h2 className="font-bold text-5xl">Sign Up Now to Access Your Cabinet</h2>
				<p>
					Closed Cabinets should be for your eyes only, create an account with access to just you.
				</p>
			</section>
			<section className="flex justify-center items-center bg-black p-6">
				<form className="flex items-center justify-center w-full h-full" onSubmit={handleSignup}>
					<div className="flex flex-col w-full m-5 space-y-9 ">
						{error && <p className="text-red-500">{error}</p>}
						<div className="space-y-4">
							<div className="flex flex-col">
								<label htmlFor="username">USERNAME</label>
								<input className="ring-2 ring-slate-600 rounded-xl" type="text" name="username" id="username" required />
							</div>
							<div className="flex flex-col">
								<label htmlFor="email">EMAIL</label>
								<input className="ring-2 ring-slate-600 rounded-xl" type="email" name="email" id="email" required />
							</div>
							<div className="flex flex-col">
								<label htmlFor="password">PASSWORD</label>
								<input className="ring-2 ring-slate-600 rounded-xl text-black" type="password" name="password" id="password" required />
							</div>
						</div>
						<button type="submit" className="mt-4 bg-slate-700 text-white rounded-xl p-2">
							Sign Up
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}
