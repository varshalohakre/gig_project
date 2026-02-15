import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/login/login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserPage from "./pages/User/UserPage";
import store, { persistor } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Myaccount from "./pages/myaccount/myaccount";
import Bookings from "./pages/bookings/bookings";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Homepage from "./pages/HomePage/HomePage";
// import Header from "./components/Header/Header";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GoogleOAuthProvider clientId="655936708831-6cv2t8h7v7gu3j7l0ibcsdg5dh59ikvb.apps.googleusercontent.com">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/talent-artists" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user/:id" element={<UserPage />} />
                <Route path="talent-artists/user/:id" element={<UserPage />} />
                <Route path="/myaccount/:id" element={<Myaccount />} />
                <Route
                  path="/booking-requests/:userId"
                  element={<Bookings />}
                />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </BrowserRouter>
          </GoogleOAuthProvider>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
