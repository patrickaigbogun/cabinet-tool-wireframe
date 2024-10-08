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
		<div className="font-bold grid grid-cols-1 sm:grid-cols-2 h-screen bg-gray-400 ">
			<section className="space-y-6 bg-slate-700 h-screen sm:h-full flex flex-col justify-center p-6 ">
				<h2 className="font-extrabold text-5xl">Sign Up Now <br /> and get Access to Your Cabinet</h2>
				<p>
					Closed Cabinets should be for your eyes only, create an account with access to just you.
				</p>
			</section>
			<section className="h-screen sm:h-full flex justify-center items-center bg-black p-6">
				<form className="flex items-center justify-center w-full h-full" onSubmit={handleSignup}>
					<div className="flex flex-col w-full m-5 space-y-12 ">
						{error && <p className="text-red-500">{error}</p>}
						<div className="space-y-6">
							<div className="flex flex-col gap-y-2">
								<label className="text-lg" htmlFor="username">USERNAME</label>
								<input className="ring-2 ring-slate-600 rounded-lg text-black p-3" type="text" name="username" id="username" required />
							</div>
							<div className="flex flex-col gap-y-2">
								<label className="text-lg" htmlFor="email">EMAIL</label>
								<input className="ring-2 ring-slate-600 rounded-lg text-black p-3" type="email" name="email" id="email" required />
							</div>
							<div className="flex flex-col gap-y-2">
								<label className="text-lg" htmlFor="password">PASSWORD</label>
								<input className="ring-2 ring-slate-600 rounded-lg text-black p-3" type="password" name="password" id="password" required />
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
