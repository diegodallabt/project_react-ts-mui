import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Auth from "./routes/Auth";


const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="project_react-ts-mui/" element={<Home />} />
            <Route path="project_react-ts-mui/auth" element={<Auth />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;