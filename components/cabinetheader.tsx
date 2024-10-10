// @/components/header.tsx (Client Component)
'use client'
import { SignOut, UserCircleCheck } from "@phosphor-icons/react/dist/ssr";
import { Logout } from '@/actions/auth';  // Import the token validation function

function CabinetHeader() {
	return (
		<header>
			<div className="p-4 flex flex-row justify-between items-center">
				<div className="font-extrabold">Closed Cabinet</div>
					<span className="flex flex-row gap-x-5 items-center" >
					<button className=" hover:brightness-75 flex p-2 gap-2 items-center hover:border-l-2 hover:border-purple-400">
						<UserCircleCheck size={32} weight="bold" />
					</button>
				<button className="hover:brightness-75 flex p-2 gap-2 items-center hover:border-l-2 hover:border-purple-400" onClick={Logout}>
						<SignOut size={28} weight="bold" />
				</button>
					</span>
			</div>
		</header>
	);
}

export default CabinetHeader;
