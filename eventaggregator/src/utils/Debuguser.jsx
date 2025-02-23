import React, { useEffect, useState } from "react";
import UserData from "./UserData";
import migrateUsersToUIDDocs from "./switchtouserid.jsx"
function TestUserData() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchData() {

      try {
        const testUID = sessionStorage.getItem("userUid");
        // const testUID = "GwulCuTcoDb8lreTMoA3q9ZHXIt2"; // to test 
        const user = new UserData(testUID);
        try {
          const data = await user.getUserData();
          setUserData(data);
        } catch (errorusername) {
          console.error("Error fetching user data:", errorusername);
        }
      } catch (erroruid) {
        console.error("User ID Not found, please log in.", erroruid);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Test User Data</h1>
      <p>Oddest bug ever: be sure to disable your ad blocker before making any calls to firebase.</p>
      <p>Defaults to current logged in user, displays null if not logged in</p>
      <p>to test other users, see eventaggregator\src\utils\Debuguser.jsx</p>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
}

export default TestUserData;