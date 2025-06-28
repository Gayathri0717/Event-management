import '../styles/globals.css';
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "../store";
import type { AppProps } from 'next/app';
import type { Session } from "next-auth";
import 'leaflet/dist/leaflet.css';

interface MyAppProps extends AppProps {
  pageProps: {
    session: Session | null;
    [key: string]: any;
  };
}

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </SessionProvider>
  );
}
