/*
|--------------------------------------------------------------------------
| React and Router
|--------------------------------------------------------------------------
*/

import { QueryClientProvider } from '@tanstack/react-query';
import * as logger from '@tauri-apps/plugin-log';
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';

import queryClient from './lib/query-client';

/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/
import 'font-awesome/css/font-awesome.css';
import 'normalize.css/normalize.css';
import './styles/general.css';

/*
|--------------------------------------------------------------------------
| Render the app
|--------------------------------------------------------------------------
*/

(async function createRoot() {
  await logger.attachConsole();

  const wrap = document.getElementById('wrap');
  const router = (await import('./routes')).default;

  if (wrap) {
    const root = ReactDOM.createRoot(wrap);
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </React.StrictMode>,
    );
  } else {
    document.body.innerHTML = '<div style="text-align: center;">x_x</div>';
  }
})();
