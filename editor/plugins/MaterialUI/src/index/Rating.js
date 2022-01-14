import * as React from "react";
import ReactDOM from "react-dom";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";

const currentScript = document.currentScript;
const el = document.createElement("div");
window.attachToEditor(el, currentScript);
document.body.appendChild(el);

export default function BasicRating() {
  const [value, setValue] = React.useState(2);

  return (
    <Box
      sx={{
        "& > legend": { mt: 2 },
      }}
    >
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    </Box>
  );
}

ReactDOM.render(<BasicRating />, el);
