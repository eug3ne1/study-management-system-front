export default function Footer() {

    return(
            
      <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        <p>© {new Date().getFullYear()} DeepDiveStudy. Усі права захищені.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-300">Умови використання</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-300">Політика конфіденційності</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-300">Контакти</a>
        </div>
      </div>
    </footer>
    )
}