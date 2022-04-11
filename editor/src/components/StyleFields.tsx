import { Grid, TextField, Button, Autocomplete } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import React from 'react';

import { cssStyles } from './styles';

export const StyleFields = ({ styles, onAddStyle, onMakeDraggable }: any) => {
  const onSubmit = (values: any, { resetForm }: any) => {
    if (onAddStyle(values)) {
      resetForm();
    }
  };

  return (
    <Formik initialValues={{ name: '', value: '' }} onSubmit={onSubmit}>
      {({ setFieldValue }) => (
        <Form>
          {styles.map(({ name, value }: any) => (
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
                renderInput={(params: any) => (
                  <TextField {...params} label="Style" variant="standard" />
                )}
                onChange={(e: any, value: any) => setFieldValue('name', value)}
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
          <Button type="submit" variant="contained">
            Add
          </Button>
        </Form>
      )}
    </Formik>
  );
};
