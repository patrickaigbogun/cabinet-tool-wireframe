import type { Metadata } from "next";
import "./globals.css";
import '@radix-ui/themes/styles.css';
import { Theme,  } from '@radix-ui/themes';
import { ThemeProvider } from 'next-themes';
import Header from "@/components/header";
import Footer from "@/components/footer";



export const metadata: Metadata = {
	title: "Cabinet Tool",
	description: "Web storage utility",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<ThemeProvider attribute="class">
					<Theme accentColor="purple" grayColor="mauve" radius="large">
						<Header />
						{children}
						{/* <ThemePanel /> */}
						<Footer />
					</Theme>
				</ThemeProvider>
			</body>
		</html>
	);
}
