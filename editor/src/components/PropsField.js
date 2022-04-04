import { Grid, TextField } from "@mui/material";

export default function PropsField({ onSave, props }) {
  return Object.entries(props).map(([ key, value ]) => (
      <Grid container key={key}>
        <Grid item xs={6}>
        <TextField
            defaultValue={key}
            variant="standard"
            label="Key"
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            defaultValue={value}
            variant="standard"
            label="Value"
            onBlur={e => onSave({key, value: e.target.value })}
          />
      </Grid>
      </Grid>
    )
  );
}
