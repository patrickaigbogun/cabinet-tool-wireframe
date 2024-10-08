// @/components/header.tsx (Client Component)
'use client'
import { useEffect, useState } from 'react';
import { UserCircleDashed } from "@phosphor-icons/react/dist/ssr";
import { validateToken } from '@/actions/auth';  // Import the token validation function

function Header() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Check for token on site load
	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (token && validateToken(token)) {
			setIsLoggedIn(true);
		}
	}, []);

	// Handle login button click
	const handleLogin = () => {
		if (isLoggedIn) {
			window.location.replace("/closedcabinet");  // Redirect to cabinet if logged in
		} else {
			window.location.replace("/auth/signup");  // Redirect to signup/login if not logged in
		}
	};

	return (
		<header>
			<div className="p-4 flex flex-row justify-between">
				<div className="font-extrabold">Cabinet Tool</div>
				<div className="hover:brightness-75">
					<button className="flex p-2 gap-2 items-center hover:border-l-2 hover:border-purple-400" onClick={handleLogin}>
						{isLoggedIn ? 'Go to Cabinet' : 'Login'}
						<UserCircleDashed size={32} weight="duotone" />
					</button>
				</div>
			</div>
		</header>
	);
}

export default Header;
