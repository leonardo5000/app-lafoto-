import React, { useEffect, useState } from "react";
import { initDatabase } from "./src/db/database";
import HomeScreen from "./src/screens/HomeScreen";
import AddPhotoScreen from "./src/screens/AddPhotoScreen";
import MapScreen from "./src/screens/MapScreen";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"home" | "add" | "map">("home");

  useEffect(() => {
    initDatabase();
  }, []);

  switch (currentScreen) {
    case "add":
      return <AddPhotoScreen onNavigateBack={() => setCurrentScreen("home")} />;
    case "map":
      return <MapScreen onNavigateBack={() => setCurrentScreen("home")} />;
    case "home":
    default:
      return <HomeScreen onNavigateTo={(screen) => setCurrentScreen(screen)} />;
  }
}