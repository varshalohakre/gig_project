import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Login from "../login/login";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  getUserinfoAsync,
  selectUser,
  updateUserDetailsAsync,
  uploadProfileImageAsync,
} from "../../features/userSlice";
import { useParams } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import "./myaccount.css";
import { selectAuthRoles } from "../../features/authSlice";
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const Myaccount = () => {
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const roles = useSelector(selectAuthRoles);
  const [image, setImage] = useState(null);

  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const apiurl = process.env.REACT_APP_API_URL;
  const handleUpload = async () => {
    setUploadSuccess(false);
    setUploadError(null);

    if (!image) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", image);

    try {
      const response = await fetch(`${apiurl}/user/upload/${id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      setUploadSuccess(true);
      console.log("Profile picture uploaded:", data);
    } catch (error) {
      setUploadError(error.message);
      console.error("Upload failed:", error);
    }
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];

    if (!uploadedFile.type.match("image/.*")) {
      alert("Please select an image file.");
      return;
    }
    setImage(uploadedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePicture(event.target.result);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const getUserInfo = () => {
    try {
      dispatch(getUserinfoAsync(id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [dispatch, id]);

  useEffect(() => {
    setFormState({
      email: user?.email || "",
      name: user?.name || "",
      mobileNumber: user?.mobileNumber || "",
      description: user?.profile?.description || "",
      portfolio: user?.profile?.portfolio || [],
      category: user?.profile?.category || [],
      pricing: user?.profile?.pricing || { min: 0, max: 0 },
      location: user?.profile?.location || "",
    });
  }, [user,setShowModal]);

  const [formState, setFormState] = useState({
    email: "",
    name: "",
    mobileNumber: "",
    description: "",
    portfolio: [],
    category: [],
    location: "",
    pricing: {
      min: 0,
      max: 0,
    },
  });

  console.log(formState);

  const [newCategory, setNewCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "min" || name === "max") {
      setFormState((prevState) => ({
        ...prevState,
        pricing: {
          ...prevState.pricing,
          [name]: value,
        },
      }));
    } else {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  const handleCategoryChange = (category) => {
    setFormState((prevState) => {
      const newCategories = prevState.category.includes(category)
        ? prevState.category.filter((item) => item !== category)
        : [...prevState.category, category];
      return { ...prevState, category: newCategories };
    });
  };

  const handleAddPortfolio = () => {
    setFormState({
      ...formState,
      portfolio: [...formState.portfolio, ""],
    });
  };

  const handlePortfolioChange = (index, value) => {
    const newPortfolio = [...formState.portfolio];
    newPortfolio[index] = value;
    setFormState({
      ...formState,
      portfolio: newPortfolio,
    });
  };

  const handleAddCategory = () => {
    if (newCategory && !availableCategories.includes(newCategory)) {
      setAvailableCategories((prevCategories) => [
        ...prevCategories,
        newCategory,
      ]);
      setFormState((prevState) => ({
        ...prevState,
        category: [...prevState.category, newCategory],
      }));
      setNewCategory("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedDetails = { ...formState };

    if (image) {
      handleUpload();
    }

    await dispatch(
      updateUserDetailsAsync({ userId: id, userDetails: updatedDetails })
    );
    Swal.fire({
      icon: "success",
      title: "Changes Saved!",
      showConfirmButton: false,
      timer: 1500,
    });

    // Reload user info to display latest changes
    setTimeout(() => {
      getUserInfo();
    }, 200);
  };

  const theme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#000",
        paper: "#111",
      },
      text: {
        primary: "#fff",
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            marginBottom: "1rem",
            "& .MuiInputBase-input": {
              color: "#fff",
            },
            "& .MuiInputLabel-root": {
              color: "#fff",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#fff",
              },
              "&:hover fieldset": {
                borderColor: "#ccc",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#fff",
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "#000",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#ccc",
            },
          },
        },
      },
    },
  });

  return (
    <>
      <Header showModal={showModal} setShowModal={setShowModal} />
      {showModal && <Login showModal={showModal} setShowModal={setShowModal} />}
      <div className="account-settings">
        <h2>Account Settings</h2>
        {roles?.includes("talent_artist") ? (
          <div className="myaccounts-main">
            <div
              className="profile-picture"
              onClick={() => document.getElementById("file-input").click()}
            >
              {profilePicture ? (
                <img
                  className="profile-photo"
                  src={profilePicture}
                  alt="Profile Picture"
                />
              ) : user?.profile?.profileImage !== null &&
                user?.profile?.profileImage !== "" ? (
                <img
                  className="profile-photo"
                  src={user?.profile?.profileImage}
                  alt="Default Profile Picture"
                />
              ) : (
                <img
                  className="profile-photo"
                  src="https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png"
                  alt="Profile Picture"
                />
              )}
              <div>Upload Your Profile Photo</div>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <PhotoCamera className="upload-icon" />
            </div>
            <form className="myacc-form" onSubmit={handleSubmit}>
              <div className="form-labels">
                <label>Email</label>
                <input
                  className="input-myaccounts"
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-labels">
                <label>Name</label>
                <input
                  className="input-myaccounts"
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-labels">
                <label>Mobile Number</label>
                <input
                  className="input-myaccounts"
                  type="text"
                  name="mobileNumber"
                  value={formState.mobileNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="form-labels">
                <label>location</label>
                <input
                  className="input-myaccounts"
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-labels">
                <label style={{ marginBottom: "0.7rem" }}>Pricing</label>
                <TextField
                  id="min-price"
                  label="Min Price"
                  variant="outlined"
                  type="number"
                  fullWidth
                  name="min"
                  value={formState.pricing.min}
                  onChange={handleChange}
                  required
                  className="input-myaccounts2"
                  style={{ marginBottom: "1rem", width: "100%" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  id="max-price"
                  label="Max Price"
                  variant="outlined"
                  type="number"
                  fullWidth
                  name="max"
                  value={formState.pricing.max}
                  onChange={handleChange}
                  required
                  className="input-myaccounts2"
                  style={{ marginBottom: "1rem", width: "100%" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="form-labels">
                <label>Description</label>
                <textarea
                  className="input-myaccounts"
                  style={{ resize: "none" }}
                  name="description"
                  value={formState.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-labels">
                <label>Portfolio (Add YouTube Video URLs)</label>
                {formState.portfolio.map((url, index) => (
                  <input
                    className="input-myaccounts"
                    style={{ width: "50%" }}
                    key={index}
                    type="text"
                    value={url}
                    onChange={(e) =>
                      handlePortfolioChange(index, e.target.value)
                    }
                    placeholder="YouTube URL"
                  />
                ))}

                <button
                  className="btn"
                  style={{ width: "50%" }}
                  type="button"
                  onClick={handleAddPortfolio}
                >
                  Add Portfolio
                </button>
              </div>

              <div className="form-labels">
                <label>Category</label>
                <div className="categories">
                  {formState?.category?.map((cat) => (
                    <div key={cat}>
                      <input
                        type="checkbox"
                        value={cat}
                        checked={formState.category.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                      />
                      <label htmlFor={cat}>{cat}</label>
                    </div>
                  ))}
                </div>

                <div className="add-category">
                  <input
                    type="text"
                    className="input-myaccounts"
                    placeholder="New Category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <button
                    className="btn"
                    type="button"
                    onClick={handleAddCategory}
                  >
                    Add Category
                  </button>
                </div>
              </div>

              <button className="custom-btn" type="submit">
                Save Changes
              </button>
            </form>
          </div>
        ) : (
          <div className="talent_seeker_myaccounts">
            You are currently a talent seeker....
          </div>
        )}
      </div>
    </>
  );
};

export default Myaccount;
