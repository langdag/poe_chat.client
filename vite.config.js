import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ jsx: true })],
  // esbuild: {
  //   loader: 'jsx', // Treat .js files as JSX
  //   include: /\.js$/, // Ensure it includes .js files
  //   jsxFactory: 'React.createElement',
  //   jsxFragment: 'React.Fragment',
  // },
});