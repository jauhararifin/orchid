import React from 'react'
import { TextField } from '@material-ui/core'
import { Button } from '@blueprintjs/core'
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
    <div>{onNowClick && <Button icon="time" minimal={true} onClick={onNowClick} />}</div>
  </div>
)
