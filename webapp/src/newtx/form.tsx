import React from 'react'
import { FormikProps } from 'formik'
import { FormGroup, Icon } from '@blueprintjs/core'
import Button from '@material-ui/core/button'
import { MenuItem, TextField, Select } from '@material-ui/core'
import { TimestampInput } from './timestamp'
import moment from 'moment'
import { ChannelInput, IChannel } from './channel'

export interface NewTxData {
  timestamp: number
  name: string
  value?: number
  currency: string
  channelSource: string
  channelDestination: string
  category: string
  description?: string
}

export type NewTxFormProps = FormikProps<NewTxData>

export const NewTxForm: React.FC<NewTxFormProps> = ({
  handleChange,
  handleBlur,
  handleSubmit,
  submitForm,
  setFieldValue,
  values
}) => (
  <form onSubmit={handleSubmit}>
    <TimestampInput
      name="timestamp"
      value={values.timestamp}
      onChange={ts => setFieldValue('timestamp', ts)}
      onNowClick={() => setFieldValue('timestamp', moment().unix())}
    />

    <TextField
      name="name"
      value={values.name}
      onChange={handleChange}
      onBlur={handleBlur}
      label="Name"
      fullWidth={true}
    />

    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ marginRight: 10, flexGrow: 1 }}>
        <TextField
          name="value"
          value={values.value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Amount"
          fullWidth={true}
          type="number"
        />
      </div>
      <div className="bp3-select" style={{ flexGrow: 0 }}>
        <Select name="currency" value={values.currency} onChange={handleChange} onBlur={handleBlur}>
          <MenuItem value="SGD">SGD</MenuItem>
          <MenuItem value="IDR">IDR</MenuItem>
        </Select>
      </div>
    </div>

    <FormGroup label="Channel" labelInfo="(required)" style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ChannelInput
          name="channelSource"
          onBlur={handleBlur}
          value={values.channelSource}
          placeholder="Source"
          onItemSelect={(item: IChannel) => {
            setFieldValue('channelSource', item)
          }}
        />
        <Icon style={{ marginLeft: 10, marginRight: 10 }} icon="arrow-right" />
        <ChannelInput
          name="channelDestination"
          onBlur={handleBlur}
          value={values.channelDestination}
          placeholder="Destination"
          onItemSelect={(item: IChannel) => {
            setFieldValue('channelDestination', item)
          }}
        />
      </div>
    </FormGroup>

    <Select
      name="category"
      value={values.category}
      onChange={handleChange}
      onBlur={handleBlur}
      fullWidth={true}
      placeholder="Category"
    >
      <MenuItem value="Food">Food</MenuItem>
      <MenuItem value="Transportation">Transportation</MenuItem>
      <MenuItem value="Utilities">Utilities</MenuItem>
      <MenuItem value="Entertaiment">Entertaiment</MenuItem>
      <MenuItem value="Rent">Rent</MenuItem>
      <MenuItem value="Vacation">Vacation</MenuItem>
      <MenuItem value="Other">Other</MenuItem>
    </Select>

    <TextField
      name="description"
      value={values.description}
      onChange={handleChange}
      onBlur={handleBlur}
      fullWidth={true}
      multiline={true}
      placeholder="Description"
      variant="outlined"
      style={{ marginTop: 10 }}
    />

    <Button onClick={submitForm} variant="contained" color="primary" style={{ marginTop: 10 }}>
      Submit
    </Button>
  </form>
)
