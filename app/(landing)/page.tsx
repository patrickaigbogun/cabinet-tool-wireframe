// import { Microphone, OpenAiLogo, Plus } from "@phosphor-icons/react/dist/ssr";

import { CloudArrowUp, Export, FolderLock, Globe } from "@phosphor-icons/react/dist/ssr";


function LandingPage() {
	return (
		<section className="space-y-12 p-8 font-bold">
			{/* Hero Section */}
			<section className="text-center bg-gray-800 rounded-lg p-5 space-y-5">
				<h2 className="text-4xl font-bold">
					Simplify Your File Storage & Sharing
				</h2>
				<p className="text-lg">
					Cabinet Tool offers a free, easy, and secure way to upload, store, and
					share your files from your personalized dashboard.
				</p>
				<button className="bg-[#513976] text-white py-3 px-6 rounded-lg hover:scale-105 transition ease-linear">
					Get Started for Free
				</button>
			</section>

			{/* Features Section */}
			<section className="text-center p-5 space-y-5">
				<h2 className="text-4xl font-bold">
					Key Features Designed for You
				</h2>
				<p className="text-lg">
					Upload your files effortlessly, access them anytime, and share links
					in just a few clicks. Your file management has never been this
					seamless.
				</p>
				<ul className="flex h-fit flex-row items-center p-6 gap-x-8 text-start bg-gray-900/50 rounded-xl justify-between overflow-x-scroll scrollbar-thin scrollbar-thumb-black/40 scrollbar-corner-black/40 scrollbar-thumb-rounded-full scrollbar-track-slate-700/20 snap-x snap-mandatory scroll-smooth">
					<li className="flex flex-row sm:flex-col items-center gap-4 h-[150px] sm:h-[300px] snap-center">
						<CloudArrowUp size={96} weight="fill" />
						<p>Unlimited file uploads</p>
					</li>
					<li className="flex flex-row sm:flex-col items-center gap-4 h-[150px] sm:h-[300px] snap-center">
						<FolderLock size={96} weight="fill" />
						<p>Secure file storage on your dashboard</p>
					</li>
					<li className="flex flex-row sm:flex-col items-center gap-4 h-[150px] sm:h-[300px] snap-center">
						<Export size={96} weight="fill" />
						<p>Easy file sharing via downloadable links</p>
					</li>
					<li className="flex flex-row sm:flex-col items-center gap-4 h-[150px] sm:h-[300px] snap-center">
						<Globe size={96} weight="fill" />
						<p>Access from anywhere, anytime</p>
					</li>
				</ul>

			</section>

			{/* Onboarding Section */}
			<section className="text-center bg-gray-800 p-5 rounded-lg space-y-5">
				<h2 className="text-3xl font-semibold mb-4">
					Get Started in Seconds
				</h2>
				<p className="text-lg mb-6">
					Join now, upload your first file, and see how easy it is to manage
					your documents. No hassle, just action.
				</p>
				<button className="bg-[#513976] text-white py-3 px-6 rounded-lg hover:scale-105 transition ease-linear">
					Start Uploading Now
				</button>
			</section>

			{/* Final CTA Section */}
			<section className="text-center p-5 space-y-5">
				<h2 className="text-3xl font-bold mb-4">
					Ready to Take Control of Your Files?
				</h2>
				<p className="text-lg mb-6">
					Cabinet Tool gives you everything you need to store and share your
					files for free. Sign up today and simplify your workflow.
				</p>
				<button className="border-2 border-[#54178d] text-white py-3 px-6 rounded-lg hover:scale-105 transition ease-linear">
					Join Cabinet Tool Now
				</button>
			</section>

			{/* this was used to test out code for your blogpost on creating copilot inputbar */}


			{/* <div className="w-[70%] mx-auto p-0 bg-blue-950 h-52 items-center flex " >
			<section className="flex flex-row bg-cyan-800 w-[30%] mx-auto hover:w-full justify-center p-2 border-1 border-black rounded-lg shadow-lg">
				<button>
					<OpenAiLogo size={24} weight="bold"/>
				</button>
				<button>
					<Plus size={24} weight="bold" />
				</button>
				<input className="w-full" type="text" />
				<button className="justify-end" >
				<Microphone size={24} weight="bold" />

				</button>

			</section>
			</div> */}
		</section>

	);
}

export default LandingPage;
