// import '@/styles/globals.scss'
// //import REDUX
// import { Provider } from "react-redux";
// import store from "@/store";
// import { PersistGate } from "redux-persist/integration/react";
// import { persistStore } from "redux-persist";

// export default function App({ Component, pageProps }) {
//   const persistor = persistStore(store);

//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <Component {...pageProps} />
//       </PersistGate>
//       {/* <Script
//         src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"
//         integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN"
//         crossorigin="anonymous"
//       /> */}
//     </Provider>
//   );
// }

import "@/styles/globals.scss";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
