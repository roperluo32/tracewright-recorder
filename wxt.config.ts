import { fileURLToPath } from 'node:url';
import { defineConfig } from 'wxt';
import react from '@vitejs/plugin-react';

const srcAlias = fileURLToPath(new URL('./src', import.meta.url));
const e2eHostPermissions = process.env.TRACEWRIGHT_E2E_HOST_PERMISSIONS === '1';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [react()],
    resolve: {
      alias: {
        '@': srcAlias,
      },
    },
  }),
  manifest: ({ browser }) => ({
    name: '__MSG_extensionName__',
    short_name: 'Tracewright',
    description: '__MSG_extensionDescription__',
    default_locale: 'en',
    version: '0.1.0',
    permissions: ['activeTab', 'scripting', 'storage', 'tabs', 'downloads'],
    host_permissions: e2eHostPermissions ? ['http://127.0.0.1/*', 'http://localhost/*'] : undefined,
    action: {
      default_title: 'Tracewright Recorder',
      default_icon: {
        16: 'icon-16.png',
        32: 'icon-32.png',
        48: 'icon-48.png',
        128: 'icon-128.png',
      },
    },
    icons: {
      16: 'icon-16.png',
      32: 'icon-32.png',
      48: 'icon-48.png',
      128: 'icon-128.png',
    },
    options_ui: {
      page: 'options.html',
      open_in_tab: true,
    },
    browser_specific_settings:
      browser === 'firefox'
        ? {
            gecko: {
              id: 'tracewright-recorder@example.com',
              strict_min_version: '109.0',
              data_collection_permissions: {
                required: ['none'],
              },
            },
          }
        : undefined,
  }),
});
