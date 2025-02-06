import React, { useRef } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/homePage";
import { LearnPage } from "./pages/learningPage";
import { Header } from "./components/header";
import { SignupPage } from "./features/signup";
import { LoginPage } from "./features/login";


/**
 * App main structure of the web & web extension
 *
 * @returns {JSX.Element} - Returns the HTML code with Routes for link clicks.
 */

const App: React.FC = () => {
  const homepageDivRef = useRef<HTMLDivElement | null>(null);

  return (
    <Router
        future =
        {{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
        >
        <div ref={homepageDivRef} className="page bg-white dark:bg-slate-800 limit--width">
            <Header />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/learnpage" element={<LearnPage homepageDivRef={homepageDivRef} />} />
            </Routes>
        </div>
    </Router>
  );
};

export default App;
