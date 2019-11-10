import React from 'react';
import { H1 } from '@blueprintjs/core';
import { NewTxForm } from './form';
import moment from 'moment';
import { Formik } from 'formik';

const NewTX: React.FC = () => {
  return (
    <div style={{ margin: '15px 10px' }}>
      <H1>New Transaction</H1>

      <Formik
        initialValues={{
          name: '',
          timestamp: moment().unix(),
          currency: 'SGD',
          channelSource: 'Cash',
          channelDestination: 'Expense',
          category: 'Transportation'
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          setSubmitting(false);
        }}
        component={NewTxForm}
      ></Formik>
    </div>
  );
};

export default NewTX;
