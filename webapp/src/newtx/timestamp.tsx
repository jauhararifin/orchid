import React from 'react';
import { DateInput, TimePrecision } from '@blueprintjs/datetime';
import { Button } from '@blueprintjs/core';
import moment from 'moment';

export interface TimestampInputProps {
  name: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  value: number;
  onNowClick?: () => void;
  onChange: (selectedTimestamp: number) => void;
}

export const TimestampInput: React.FC<TimestampInputProps> = ({ name, onBlur, value, onNowClick, onChange }) => (
  <div style={{ display: 'flex' }}>
    <div style={{ marginRight: 5 }}>
      <DateInput
        inputProps={{ name, onBlur }}
        formatDate={date => moment(date).format('DD-MM-YYYY HH:mm:ss')}
        parseDate={str => moment(str, 'DD-MM-YYYY HH:mm:ss').toDate()}
        placeholder={'DD-MM-YYYY HH:mm:ss'}
        timePrecision={TimePrecision.SECOND}
        value={moment.unix(value).toDate()}
        defaultValue={moment().toDate()}
        onChange={(date: Date) => onChange(moment(date).unix())}
      />
    </div>
    <div>{onNowClick && <Button icon="time" minimal={true} onClick={onNowClick} />}</div>
  </div>
);
