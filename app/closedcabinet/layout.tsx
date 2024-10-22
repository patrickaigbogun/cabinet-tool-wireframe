
'use client';

// import type { Metadata } from "next";
import { useEffect } from 'react'
import '@radix-ui/themes/styles.css';
import "../globals.css";
import { Theme } from '@radix-ui/themes';
import { ThemeProvider } from 'next-themes';
import CabinetHeader from "@/components/cabinetheader";
import { validateToken } from "@/actions/auth";
import { useRouter } from 'next/navigation'

// export const metadata: Metadata = {
// 	title: "Cabinet Tool",
// 	description: "Web storage utility",
// };



export default function ClosedCabinetLayout({ children }: { children: React.ReactNode }){
const router = useRouter()

// Check for token on site load
useEffect(() => {
	const token = localStorage.getItem("authToken");
	if (token && validateToken(token)) {
		router.push('/closedcabinet')
	}
}, [router]);

	return (
		<html lang="en">
			<body>
				<ThemeProvider attribute="class">
					<Theme accentColor="purple" grayColor="mauve" radius="large">
						<CabinetHeader />
						<main className="flex-grow">
							{children}
						</main>
					</Theme>
				</ThemeProvider>
			</body>
		</html>
	)
}
