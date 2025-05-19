import AuthDialog from "./AuthDialog";

export default function Header() {
  return (
    <header className="p-4 flex justify-end bg-white dark:bg-gray-800">
      <AuthDialog />
    </header>
  );
}
