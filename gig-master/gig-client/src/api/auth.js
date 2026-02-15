const apiurl = process.env.REACT_APP_API_URL;
export const login = async (credentials) => {
  try {
    const response = await fetch(`${apiurl}/auth/login`, {
      method: "POST", // Specify POST method for login request
      headers: {
        "Content-Type": "application/json", // Set appropriate header for JSON data
      },
      body: JSON.stringify(credentials), // Stringify credentials object
    });

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`); // Handle non-2xx status codes
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};
export const register = async (credentials) => {
  try {
    const response = await fetch(`${apiurl}/auth/register`, {
      method: "POST", // Specify POST method for login request
      headers: {
        "Content-Type": "application/json", // Set appropriate header for JSON data
      },
      body: JSON.stringify(credentials), // Stringify credentials object
    });
    
    if (!response.ok) {
      throw new Error(`Register failed with status ${response.status}`); // Handle non-2xx status codes
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${apiurl}/auth/logout/user`, {
      method: "GET", // Specify GET method for logout request
      headers: {
        "Content-Type": "application/json", // Set appropriate header for JSON data
        // Optionally, include any authentication headers if required
        // "Authorization": `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`Logout failed with status ${response.status}`); // Handle non-2xx status codes
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error; // Re-throw the error for handling in the calling code
  }
};

export const googleSignin = async (response) => {
  const bodyObject = {
    authId: await response.credential,
  };
  console.log(await response);
  try {
    if (!response.errors) {
      const postResponse = await fetch(
        `${apiurl}/auth/login/user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyObject),
        }
      );
      const postData = await postResponse.json();
      if (!postData.error) {
        return postData;
      } else {
        console.log(postData.error);
      }
    }
  } catch (e) {
    console.log(e);
  }
};
