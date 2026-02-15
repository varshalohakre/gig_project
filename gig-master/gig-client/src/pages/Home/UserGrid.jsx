import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Rating,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const UserGrid = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const apiurl = process.env.REACT_APP_API_URL;
  const getAllUserData = async () => {
    try {
      const response = await fetch(`${apiurl}/user/talent-artists`);
      const data = await response.json();
      setUsers(data);
      setLoading(false); // Set loading to false once data is fetched
      console.log(data);
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  useEffect(() => {
    getAllUserData();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchQuery) ||
        user.category.some((cat) => cat.toLowerCase().includes(searchQuery))) &&
      (category === "" || user.category.includes(category))
  );

  return (
    <Box sx={{ padding: 2, width: "80%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 3,
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search by name or category"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ marginRight: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">All</MenuItem>
            {Array.from(new Set(users.flatMap((user) => user.category))).map(
              (cat, index) => (
                <MenuItem key={index} value={cat}>
                  {cat}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers?.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
              <Box
                sx={{
                  height: "60vh",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                  padding: 2,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <button
                  onClick={() => navigate(`user/${user._id}`)}
                  style={{
                    textDecoration: "none",
                    border: "none",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </button>
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                  {user.name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 1,
                  }}
                >
                  <Rating
                    sx={{ fontSize: "0.7rem" }}
                    value={user.avgRating}
                    precision={0.1}
                    size="small"
                    readOnly
                  />
                  <Typography
                    variant="body2"
                    sx={{ marginLeft: 1, fontSize: "0.7rem" }}
                  >
                    {user.avgRating} out of 5
                  </Typography>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                  {user.category?.map((cat, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{
                        display: "inline-block",
                        padding: "2px 8px",
                        margin: "2px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                      }}
                    >
                      {cat}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UserGrid;
