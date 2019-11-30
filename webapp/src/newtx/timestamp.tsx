import React from 'react'
import { IconButton, TextField } from '@material-ui/core'
import { AccessTime } from '@material-ui/icons'
import moment from 'moment'

export interface TimestampInputProps {
  name: string
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  value: number
  onNowClick?: () => void
  onChange: (selectedTimestamp: number) => void
}

export const TimestampInput: React.FC<TimestampInputProps> = ({ name, onBlur, value, onNowClick, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
    <div style={{ marginRight: 5 }}>
      <TextField
        label="Timestamp"
        type="datetime-local"
        name={name}
        value={moment.unix(value).format('YYYY-MM-DDTHH:mm')}
        onChange={event => onChange(moment(event.target.value).unix())}
        onBlur={onBlur}
      />
    </div>
    <div>
      {onNowClick && (
        <IconButton onClick={onNowClick}>
          <AccessTime />
        </IconButton>
      )}
    </div>
  </div>
)
