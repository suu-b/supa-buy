import { useState } from "react";
import "./App.css";

function App() {
  const [currentOrderId, setCurrentOrderId] = useState(null);

  return (
    <div className="screen">
      {currentOrderId ? (
        <>
          <h2>Order {currentOrderId}</h2>
        </>
      ) : (
        <>
          <h2>Inventory Dashboard</h2>
          <div
            className="strip-card"
            onClick={() => setCurrentOrderId(currentOrderId.id)}
          >
            <div className="order-meta">
              <i className="order-id">
                <span>#</span>139383
              </i>
              <p className="subtitle">Alice Oseman</p>
            </div>

            <div className="order-dates">
              <p>
                <strong>Placed:</strong> 2026-10-21 09:30:00
              </p>
              <p>
                <strong>Delivery:</strong> 2026-10-26
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
