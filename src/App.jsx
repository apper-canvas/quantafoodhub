import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import router from "@/router";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;