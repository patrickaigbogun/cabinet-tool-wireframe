import type { Metadata } from "next";
import "../globals.css";
import '@radix-ui/themes/styles.css';


export const metadata: Metadata = {
    title: "Login to Cabinet Tool",
    description: "Web storage utility",
};

export default function LoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <main className="flex-grow">
                    {children}
                </main>
            </body>
        </html>

    );
}
