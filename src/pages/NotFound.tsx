import { LinkButton } from '../components/ui';

export function NotFound() {
  return (
    <div className="py-10 text-center">
      <p className="text-6xl" aria-hidden>
        🧭
      </p>
      <h1 className="text-3xl font-bold">We couldn't find that page</h1>
      <LinkButton to="/" variant="primary">
        🏠 Go to Home
      </LinkButton>
    </div>
  );
}
