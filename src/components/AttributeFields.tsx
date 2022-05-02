import { Grid, TextField, Button } from '@mui/material';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import React from 'react';

export interface IValues {
  name: string;
  value: string;
}

export const INITIAL_VALUES = { name: '', value: '' };

type TOnSubmit = (
  values: IValues,
  formikHelpers: FormikHelpers<IValues>
) => void | Promise<any>;

export interface IAttributeFieldsProps {
  selected: HTMLElement;
  getMirror: (element: HTMLElement) => HTMLElement;
  forceRender: () => void;
}

export const AttributeFields: React.FC<IAttributeFieldsProps> = (props) => {
  const { selected, getMirror, forceRender } = props;
  const { attributes } = selected;

  const onSubmit: TOnSubmit = (values, { resetForm }) => {
    selected.setAttribute(values.name, values.value);
    getMirror(selected).setAttribute(values.name, values.value);
    forceRender();
    resetForm();
  };

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={onSubmit}>
      {({ setFieldValue }) => (
        <Form>
          {[].map.call(attributes, ({ name, value }) => (
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
                as={TextField}
                variant="standard"
                label="Attributea"
                fullWidth
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
