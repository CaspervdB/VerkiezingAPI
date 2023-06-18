import React from "react";
import './App.css';
import { Link, Outlet } from "react-router-dom";



export function App() {
  return (
    <div>
      <header>
        <h1>Welcome VerkiezingAPI visualisation</h1>
        <p>Select XML or JSON to view data from the API in the specific format</p>
      </header>
      <nav>
        <Link to="/xml" className="link">
          <img src="https://cdn.iconscout.com/icon/free/png-256/free-xml-file-2330558-1950399.png" alt="XML" className="link_icon" />
        </Link>
        <Link to="/json" className="link">
          <img src="https://img.freepik.com/premium-vector/modern-flat-design-json-file-icon-web-simple-style_599062-468.jpg?w=250" alt="JSON" className="link_icon" />
        </Link>
        <Link to="/boom" className="link">
          <img src="https://previews.123rf.com/images/abluecup/abluecup1209/abluecup120900910/15453886-wrong-button-a-man-is-pushing-the-button.jpg?w=250" alt="Error" className="link_icon" />
        </Link>
      </nav>
      <Outlet />
      <footer>
        <p>© 2023 VerkiezingAPI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
