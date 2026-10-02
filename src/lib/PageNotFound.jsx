import { useLocation, Link } from 'react-router-dom';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.replace(/^\//, '') || 'this page';

  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian p-6 text-pearl">
      <div className="max-w-md text-center">
        <h1 className="font-heading text-7xl text-pearl/30">404</h1>
        <h2 className="mt-4 font-heading text-2xl">Page not found</h2>
        <p className="mt-3 text-sm text-muted-foreground">“{pageName}” is not part of this journal.</p>
        <Link to="/dashboard" className="mt-6 inline-flex rounded-xl bg-crimson px-4 py-2 text-sm text-pearl">Back to dashboard</Link>
      </div>
    </div>
  );
}
