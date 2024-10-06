export default function Login() {
	return (
		<div className="grid grid-cols-2 h-screen bg-gray-400 ">
			<section className="space-y-6 bg-slate-700 h-full flex flex-col justify-center p-6 ">
				<h2 className="font-bold text-5xl">
					Sign Up Now to Access Your Cabinet
				</h2>
				<p>
					Closed Cabinets should be for your eyes only, create an account with access to just you.
				</p>
			</section>
			<section className="flex justify-center items-center bg-black p-6">
				<form className="flex  items-center justify-center  w-full h-full" action="" method="post">
					<div className="flex flex-col w-full m-5 space-y-9 ">
						<div className="space-y-4" >
						<div className="flex flex-col" >
							<label htmlFor="username">USERNAME</label>
							<input className="ring-2 ring-slate-600 rounded-xl" type="text" name="username" id="username" />
						</div>
						<div className="flex flex-col" >
							<label htmlFor="email">EMAIL</label>
							<input className="ring-2 ring-slate-600 rounded-xl" type="email" name="email" id="email" />
						</div>
						<div className="flex flex-col" >
							<label htmlFor="password">PASSWORD</label>
							<input className="ring-2 ring-slate-600 rounded-xl" type="password" name="password" id="password" />
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
