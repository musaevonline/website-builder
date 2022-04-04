import { Formik, Form, Field } from "formik";
import { Grid, TextField, Button, Autocomplete } from "@mui/material";

export default function PropsField({ onDispatch, props, availableProps }) {
  const onSubmit = (values, { resetForm }) => {
    console.log(values);
    if (onDispatch(values)) {
      resetForm();
    }
  };
  return (
    <Formik initialValues={{ prop: "", value: "" }} onSubmit={onSubmit}>
      {({ setFieldValue }) => (
        <Form>
          {Object.entries(props).map(([ prop, value ]) => (
            <Grid container key={prop}>
              <Grid item xs={6}>
                {prop}
              </Grid>
              <Grid item xs={6}>
                {value}
              </Grid>
            </Grid>
          ))}
          <Grid container>
            <Grid item xs={6}>
              <Field
                name="prop"
                as={Autocomplete}
                options={availableProps}
                disableClearable
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Style" variant="standard" />
                )}
                onChange={(e, value) => setFieldValue("prop", value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                name="value"
                as={TextField}
                variant="standard"
                label="Value"
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" width="100%">
            Dispatch
          </Button>
        </Form>
      )}
    </Formik>
  );
}
