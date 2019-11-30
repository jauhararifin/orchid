import React from 'react'
import { TextField } from '@material-ui/core'
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete'

export type IChannel = string

export interface ChannelInputProps {
  name: string
  value: string
  placeholder?: string
  onInputChange: (value: string) => void
}

export const ChannelInput: React.FC<ChannelInputProps> = ({ name, onInputChange, placeholder, value }) => {
  const commonChannels = ['Cash', 'EZLink', 'DBS', 'Jenius', 'Expense', 'Income', 'Singtel', 'GoPay', 'Cheque']
  return (
    <div style={{ width: 150 }}>
      <Autocomplete
        freeSolo
        disableClearable
        options={commonChannels}
        onInputChange={(_, val) => onInputChange && onInputChange(val)}
        value={value}
        renderInput={(params: RenderInputParams) => (
          <TextField
            {...params}
            name={name}
            label={placeholder}
            margin="dense"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              name,
              type: 'search',
              style: { padding: '0 5px' }
            }}
            style={{ padding: 0 }}
            value={value}
          />
        )}
      />
    </div>
  )
}
