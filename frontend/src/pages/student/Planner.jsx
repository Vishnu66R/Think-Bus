// frontend/src/pages/student/Planner.jsx
// -------------------------------------------
// Route Planner — view all routes and stops.
// Students can browse available routes.
// -------------------------------------------


import { useState, useEffect } from "react";
import { Bus, Map } from "lucide-react";
import "./Planner.css";

// Routes and stops data matching the database
const ROUTES_DATA = [
  {
    id: 1, name: "Karunagapally", duration: "45 min",
    stops: ["Karunagapally", "Kuttivattom", "Edapallykkotta", "Sangaramangalam", "Chavara", "Neendakara", "Shakthikulangara", "Kavanadu", "Kadavoor", "College Of Engineering Perumon"],
  },
  {
    id: 2, name: "Paravoor", duration: "60 min",
    stops: ["Neduvathoor", "Ambalathumkala", "Ezhukone", "Perumpuzha", "Keralapuram", "College Of Engineering Perumon"],
  },
  {
    id: 3, name: "Mevarom", duration: "60 min",
    stops: ["Kottarakkara", "Kottarakkara Railway Station", "Nedumpayikkulam", "Kundara", "Vellimon", "Cherumoodu", "College Of Engineering Perumon"],
  },
  {
    id: 4, name: "Kottiyam", duration: "60 min",
    stops: ["Kottiyam", "Umayanalloor", "Pallimukku", "Polayathodu", "Chinnakkada", "College Of Engineering Perumon"],
  },
  {
    id: 5, name: "Paripally", duration: "60 min",
    stops: ["Paravoor", "Nedumgolam", "Thirumukku", "Kallumthazham", "Moonamkutty", "Karicode", "Chandanathope", "College Of Engineering Perumon"],
  },
  {
    id: 6, name: "Kottarakkara", duration: "60 min",
    stops: ["Mevarom", "Thattamala", "Madanada", "College Junction", "Kollam Railway Station", "High School Junction", "College Of Engineering Perumon"],
  },
  {
    id: 7, name: "Cheerankavu", duration: "60 min",
    stops: ["Paripally", "Kalluvathukal", "Karamcode", "Chathannoor", "Ithikkara", "Palathara", "SN Public School", "Mangad", "Anchalumoodu", "College Of Engineering Perumon"],
  },
];

function Planner() {
  const [selectedRoute, setSelectedRoute] = useState(null);

  return (
    <div className="planner-page" id="planner-page">
      <div className="planner-header">
        <h2 className="planner-title">Route Planner</h2>
        <p className="planner-desc">Browse all bus routes and their stops.</p>
      </div>

      <div className="planner-content">
        {/* Route List */}
        <div className="route-list-panel">
          <h3 className="panel-subtitle">All Routes</h3>
          {ROUTES_DATA.map((route) => (
            <div
              key={route.id}
              className={`route-list-item ${selectedRoute?.id === route.id ? "selected" : ""}`}
              onClick={() => setSelectedRoute(route)}
            >
              <div className="route-list-icon">
                <Bus size={20} />
              </div>
              <div className="route-list-info">
                <span className="route-list-name">Route {route.id}: {route.name}</span>
                <span className="route-list-meta">{route.stops.length} stops · {route.duration}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Stop Details */}
        <div className="route-detail-panel">
          {selectedRoute ? (
            <>
              <h3 className="panel-subtitle">
                Route {selectedRoute.id}: {selectedRoute.name}
              </h3>
              <p className="route-detail-meta">
                Duration: {selectedRoute.duration} · {selectedRoute.stops.length} stops
              </p>
              <div className="stops-timeline">
                {selectedRoute.stops.map((stop, index) => (
                  <div className={`stop-item ${index === selectedRoute.stops.length - 1 ? "last" : ""}`} key={index}>
                    <div className="stop-marker">
                      <span className="stop-number">{index + 1}</span>
                    </div>
                    <span className="stop-name">{stop}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="route-detail-empty">
              <span className="empty-icon">
                <Map size={48} />
              </span>
              <p>Select a route to view its stops</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Planner;
