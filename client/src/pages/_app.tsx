import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from '../redux/store';
import { Provider } from 'react-redux';

import '@/styles/Tiptap.css';

import { setLogger, QueryClient, QueryClientProvider } from 'react-query';
import PersistLayout from '@/layouts/PersistLayout';
import { resetServerContext } from 'react-beautiful-dnd';
import { GetServerSideProps } from 'next';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

setLogger({
  error: () => { },
  log: () => { },
  warn: () => { },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Provider
        store={store}
      >
        <QueryClientProvider client={queryClient}>
          <PersistLayout>
            <Component {...pageProps} />
          </PersistLayout>
        </QueryClientProvider>
        <ToastContainer style={{ width: 'fit-content' }} />
      </Provider>
    </ChakraProvider>
  );
}
