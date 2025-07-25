import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "@/components/pages/HomePage";
import BookingsPage from "@/components/pages/BookingsPage";
import HistoryPage from "@/components/pages/HistoryPage";
import PaymentsPage from "@/components/pages/PaymentsPage";
import BottomNavigation from "@/components/organisms/BottomNavigation";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
      </Routes>
      
      <BottomNavigation className="fixed bottom-0 left-0 right-0 z-40" />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;