import React from 'react'
import { TextField } from '@material-ui/core'
import Autocomplete, { RenderInputParams } from '@material-ui/lab/Autocomplete'

export type IChannel = string

export interface ChannelInputProps {
  name: string
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  placeholder?: string
}

export const ChannelInput: React.FC<ChannelInputProps> = ({ name, onBlur, onChange, placeholder, value }) => {
  const commonChannels = ['Cash', 'EZLink', 'DBS', 'Jenius', 'Expense', 'Income', 'Singtel', 'GoPay', 'Cheque']
  return (
    <div style={{ width: 150 }}>
      <Autocomplete
        freeSolo
        disableClearable
        options={commonChannels}
        renderInput={(params: RenderInputParams) => (
          <TextField
            {...params}
            name={name}
            label={placeholder}
            margin="dense"
            variant="outlined"
            fullWidth
            InputProps={{ ...params.InputProps, type: 'search', style: { padding: '0 5px' } }}
            style={{ padding: 0 }}
            onBlur={onBlur}
            onChange={onChange}
            value={value}
          />
        )}
      />
    </div>
  )
}
