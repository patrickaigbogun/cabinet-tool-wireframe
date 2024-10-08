// @/components/header.tsx (Client Component)
'use client'
import { SignOut, UserCircleDashed } from "@phosphor-icons/react/dist/ssr";
import {  } from '@/actions/auth';  // Import the token validation function

function CabinetHeader() {

	function handleLogout() {
		localStorage.removeItem('authToken'); // Remove the JWT token
		alert("Your cabinet stays safe.. till your return");
		window.location.replace('../'); // Redirect to login or home page
	}
		

	return (
		<header>
			<div className="p-4 flex flex-row justify-between items-center">
				<div className="font-extrabold">Closed Cabinet</div>
					<span className="flex flex-row gap-x-4 items-center" >
					<button className=" hover:brightness-75 flex p-2 gap-2 items-center hover:border-l-2 hover:border-purple-400">
						<UserCircleDashed size={32} weight="duotone" />
					</button>
				<button className="hover:brightness-75 flex p-2 gap-2 items-center hover:border-l-2 hover:border-purple-400" onClick={handleLogout}>
						<SignOut size={28} weight="fill" />
				</button>
					</span>
			</div>
		</header>
	);
}

export default CabinetHeader;
