import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LearnPage from "@/pages/LearnPage";
import VocabularyPage from "@/pages/VocabularyPage";
import ImportPage from "@/pages/ImportPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/import" element={<ImportPage />} />
      </Routes>
    </Router>
  );
}