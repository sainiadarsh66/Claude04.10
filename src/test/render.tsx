import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { AppRoutes, Providers } from '../App';

export function renderApp(path = '/') {
  return render(
    <Providers>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </Providers>,
  );
}

export function renderWithProviders(ui: ReactNode, path = '/') {
  return render(
    <Providers>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </Providers>,
  );
}
