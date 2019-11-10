import React from 'react';
import { FormikProps } from 'formik';
import { FormGroup, InputGroup, NumericInput, Icon, TextArea, Intent, Button } from '@blueprintjs/core';
import { TimestampInput } from './timestamp';
import moment from 'moment';
import { ChannelInput, IChannel } from './channel';
import { ICategory, CategoryInput } from './category';

export interface NewTxData {
  timestamp: number;
  name: string;
  value?: number;
  currency: string;
  channelSource: string;
  channelDestination: string;
  category: string;
  description?: string;
}

export type NewTxFormProps = FormikProps<NewTxData>;

export const NewTxForm: React.FC<NewTxFormProps> = ({
  handleChange,
  handleBlur,
  handleSubmit,
  setFieldValue,
  values
}) => (
  <form onSubmit={handleSubmit}>
    <FormGroup label="Timestamp" labelFor="text-input" labelInfo="(required)">
      <TimestampInput
        name="timestamp"
        value={moment().unix()}
        onChange={handleChange}
        onNowClick={() => setFieldValue('timestamp', moment().unix())}
      />
    </FormGroup>

    <FormGroup label="Name" labelFor="text-input" labelInfo="(required)">
      <InputGroup name="name" value={values.name} onChange={handleChange} onBlur={handleBlur} />
    </FormGroup>

    <FormGroup label="Amount" labelFor="text-input" labelInfo="(required)">
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 10, flexGrow: 1 }}>
          <NumericInput
            name="value"
            value={values.value}
            onBlur={handleBlur}
            onChange={handleChange}
            allowNumericCharactersOnly={true}
            fill={true}
          />
        </div>
        <div className="bp3-select" style={{ flexGrow: 0 }}>
          <select name="currency" onChange={handleChange} onBlur={handleBlur} value={values.currency}>
            <option value="SGD">SGD</option>
            <option value="IDR">IDR</option>
          </select>
        </div>
      </div>
    </FormGroup>

    <FormGroup label="Channel" labelInfo="(required)">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ChannelInput
          name="channelSource"
          onBlur={handleBlur}
          value={values.channelSource}
          placeholder="Source"
          onItemSelect={(item: IChannel) => {
            setFieldValue('channelSource', item);
          }}
        />
        <Icon style={{ marginLeft: 10, marginRight: 10 }} icon="arrow-right" />
        <ChannelInput
          name="channelDestination"
          onBlur={handleBlur}
          value={values.channelDestination}
          placeholder="Destination"
          onItemSelect={(item: IChannel) => {
            setFieldValue('channelDestination', item);
          }}
        />
      </div>
    </FormGroup>

    <FormGroup label="Category" labelInfo="(required)">
      <CategoryInput
        name="category"
        onBlur={handleBlur}
        value={values.category}
        onItemSelect={(item: ICategory) => {
          setFieldValue('category', item);
        }}
        placeholder=""
      />
    </FormGroup>

    <FormGroup label="Description" labelFor="text-area">
      <TextArea
        name="description"
        onBlur={handleBlur}
        onChange={handleChange}
        value={values.description}
        growVertically={true}
        fill={true}
        intent={Intent.PRIMARY}
        rows={5}
      />
    </FormGroup>

    <Button type="submit" intent={Intent.PRIMARY}>
      Submit
    </Button>
  </form>
);
