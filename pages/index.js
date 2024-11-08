import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { UserContext } from "../services/userContext";
import Post from "../components/Post";

const Home = () => {
  const { user, fetchTweets, addPost } = useContext(UserContext);

  const [page, setPage] = useState(1);
  const [tweets, setTweets] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const chatContainerRef = useRef(null);

  const fetchNewTweets = async () => {
    const res = await fetchTweets(page);
    setTweets([...tweets, ...res]);
  };

  const addNewTweet = async () => {
    if (newPost.trim() !== "") {
      if (newPost.length < 10) {
        setOpenSnackbar(true);
        return;
      }

      const newPostObject = {
        tweet: newPost,
        name: user.name,
        email: user.email,
      };

      try {
        const response = await addPost(newPostObject);
        setTweets([response, ...tweets]);
        setNewPost("");
      } catch (error) {
        console.error("Error creating tweet:", error);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    fetchNewTweets();
  }, [page]);

  useEffect(() => {
    scrollToBottom();
  }, [tweets]);

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Please enter at least 10 characters for your tweet.
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          maxWidth: "600px",
          margin: "auto",
        }}
        ref={chatContainerRef}
      >
        <Box
          sx={{
            width: "100%",
            marginBottom: "20px",
            padding: "2rem 0",
            overflow: "auto",
          }}
        >
          {loading ? (
            <Typography
              style={{
                width: "100%",
                textAlign: "center",
                color: "#fff",
                fontSize: "20px",
                marginTop: "20px",
                fontWeight: "bold",
              }}
            >
              Loading...
            </Typography>
          ) : (
            <div>
              {tweets.map((tweet, index) => (
                <Post
                  key={index}
                  text={tweet.tweet}
                  username={tweet.name}
                  timestamp={tweet.timeStamp}
                />
              ))}
            </div>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Button onClick={loadMore} sx={{ width: "250px" }}>
              Load More
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "fixed",
            bottom: 0,
            width: "100%",
            padding: "1rem",
          }}
        >
          <TextField
            fullWidth
            placeholder="What's happening?"
            variant="outlined"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addNewTweet();
              }
            }}
            sx={{
              color: "white",
              background: "#333",

              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#555",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#555",
              },
            }}
            InputProps={{
              style: {
                color: "white",
                placeholder: "white",
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Home;
