import React from 'react'
import { FormikProps } from 'formik'
import { Button, MenuItem, TextField, Select, Typography } from '@material-ui/core'
import { ArrowRightAlt } from '@material-ui/icons'
import { TimestampInput } from './timestamp'
import moment from 'moment'
import { ChannelInput } from './channel'

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
      variant="outlined"
      margin="dense"
    />

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: 10, flexGrow: 1 }}>
        <TextField
          name="value"
          value={values.value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          label="Amount"
          fullWidth={true}
          type="number"
          variant="outlined"
          margin="dense"
        />
      </div>
      <div style={{ flexGrow: 0, marginTop: 8, marginBottom: 4 }}>
        <Select
          name="currency"
          value={values.currency}
          onChange={handleChange}
          onBlur={handleBlur}
          variant="outlined"
          margin="dense"
        >
          <MenuItem value="SGD">SGD</MenuItem>
          <MenuItem value="IDR">IDR</MenuItem>
        </Select>
      </div>
    </div>

    <div style={{ marginTop: 10, marginBottom: 5 }}>
      <div>
        <Typography variant="subtitle2">Channels</Typography>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ChannelInput
          name="channelSource"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.channelSource}
          placeholder="Source"
        />
        <ArrowRightAlt style={{ marginLeft: 10, marginRight: 10 }} />
        <ChannelInput
          name="channelDestination"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.channelDestination}
          placeholder="Destination"
        />
      </div>
    </div>

    <Select
      name="category"
      value={values.category}
      onChange={handleChange}
      onBlur={handleBlur}
      fullWidth={true}
      placeholder="Category"
      variant="outlined"
      margin="dense"
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
