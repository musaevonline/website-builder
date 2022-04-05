import { Formik, Form, Field } from "formik";
import { cssStyles } from "./styles";
import { Grid, TextField, Button, Autocomplete } from "@mui/material";

export const StyleFields = ({ onAddStyle, styles }) => {
  const onSubmit = (values, { resetForm }) => {
    console.log(values);
    if (onAddStyle(values)) {
      resetForm();
    }
  };
  return (
    <Formik initialValues={{ name: "", value: "" }} onSubmit={onSubmit}>
      {({ setFieldValue }) => (
        <Form>
          {styles.map(({ name, value }) => (
            <Grid container key={name}>
              <Grid item xs={6}>
                {name}
              </Grid>
              <Grid item xs={6}>
                {value}
              </Grid>
            </Grid>
          ))}
          <Grid container>
            <Grid item xs={6}>
              <Field
                name="name"
                as={Autocomplete}
                options={cssStyles}
                disableClearable
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Style" variant="standard" />
                )}
                onChange={(e, value) => setFieldValue("name", value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                name="value"
                as={TextField}
                variant="standard"
                label="Value"
                fullWidth
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" width="100%">
            Add
          </Button>
        </Form>
      )}
    </Formik>
  );
}
