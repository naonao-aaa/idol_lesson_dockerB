import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, //「react-query」のデフォルトでは、フェッチに失敗した場合は、3回までリトライする設定になっている。今回は、falseを設定したので、リトライはされないようになる。
      refetchOnWindowFocus: false, //「react-query」のデフォルトでは、ユーザーがアプリケーションのブラウザにフォーカスを当てた時に、自動的にフェッチが走るようになっている。過剰なフェッチが発生する可能性があるので、今回はfalseを設定しておく。
    },
  },
});

const App = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Header />
        <main className="py-3">
          <Container>
            {/* <HomeScreen /> */}
            <Outlet />
          </Container>
        </main>
        <Footer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <ToastContainer />
    </>
  );
};

export default App;
