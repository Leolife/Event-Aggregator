import React, { useEffect, useState } from "react";
import UserData from "./UserData";

function TestUserData() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const testUID = "GwulCuTcoDb8lreTMoA3q9ZHXIt2"; // Replace with actual user ID
      const user = new UserData(testUID);
      try {
        const data = await user.getUserData();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Test User Data</h1>
      <p>Oddest bug ever: be sure to disable your ad blocker before making any calls to firebase.</p>
      <p>To change this information, head to: eventaggregator\src\utils\Debuguser.jsx, and paste your desired userID into testUID</p>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
}

export default TestUserData;