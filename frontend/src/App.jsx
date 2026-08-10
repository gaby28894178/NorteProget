import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <>
      <AppRouter />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
