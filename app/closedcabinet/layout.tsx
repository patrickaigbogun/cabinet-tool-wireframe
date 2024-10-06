import type { Metadata } from "next";
import "../globals.css";
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
	title: "Cabinet Tool",
	description: "Web storage utility",
};
export default function ClosedCabinetLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				<ThemeProvider attribute="class">
					<Theme accentColor="purple" grayColor="mauve" radius="large">
						<main className="flex-grow">
							{children}
						</main>
					</Theme>
				</ThemeProvider>
			</body>
		</html>
	)
}
