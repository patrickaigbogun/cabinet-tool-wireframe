// Header.tsx (Client Component)
'use client'
import { UserCircleDashed } from "@phosphor-icons/react/dist/ssr";

// type headerProps = {
//   // You no longer need handleLogin as a prop here
// };

function Header() {
  // Define handleLogin directly in the client component
  const handleLogin = () => {
    const isLoggedIn = false; // You can replace this logic with actual login status
    if (!isLoggedIn) {
      window.location.replace("/login");
    } else {
      window.location.replace("/closedcabinet");
    }
  };

  return (
    <header>
      <div className="p-4 flex flex-row justify-between">
        <div className="font-extrabold">Cabinet Tool</div>
        <div className="hover:brightness-75">
          <button className="flex p-2 gap-2 items-center hover:border-l-2 hover:border-purple-400" onClick={handleLogin}>
            login
            <UserCircleDashed size={32} weight="duotone" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
