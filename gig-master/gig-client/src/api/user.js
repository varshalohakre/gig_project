const apiurl = process.env.REACT_APP_API_URL;
export const getUserInfo = async (id) => {
  try {
    const response = await fetch(`${apiurl}/user/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `can not get the user info with status ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error;
  }
};

export const updateUserInfo = async (userId, userDetails) => {
  try {
    const response = await fetch(`${apiurl}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    });
    if (!response.ok) {
      throw new Error('Failed to update user info');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const uploadProfileImage = async (userId, imageFile) => {
  const formData = new FormData();
  formData.append('profileImage', imageFile);

  try {
    const response = await fetch(`${apiurl}/user/upload/${userId}`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload profile image');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
