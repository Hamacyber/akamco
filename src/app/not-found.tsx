import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center pt-20">
      <div className="container-max px-4 text-center">
        <div className="mx-auto max-w-md">
          <p className="text-7xl font-heading font-bold text-accent mb-4">404</p>
          <h1 className="font-heading text-2xl font-bold text-light-text dark:text-dark-text sm:text-3xl mb-4">
            Page Not Found
          </h1>
          <p className="text-light-muted dark:text-dark-muted leading-relaxed mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/" className="btn-primary px-8 py-3">
              Return Home
            </Link>
            <Link href="/contact" className="btn-secondary px-8 py-3">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
