import React from 'react'
import { Suggest } from '@blueprintjs/select'
import { MenuItem, Icon } from '@blueprintjs/core'

export type IChannel = string

export interface ChannelInputProps {
  name: string
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  value: string
  placeholder?: string
  onItemSelect: (item: IChannel, event?: React.SyntheticEvent<HTMLElement>) => void
}

export const ChannelInput: React.FC<ChannelInputProps> = ({ name, onBlur, placeholder, onItemSelect, value }) => {
  const ChannelSuggest = Suggest.ofType<IChannel>()
  const commonChannels = ['Cash', 'EZLink', 'DBS', 'Jenius', 'Expense', 'Income', 'Singtel', 'GoPay', 'Cheque']
  return (
    <ChannelSuggest
      inputProps={{ name, placeholder, value, onBlur }}
      items={commonChannels}
      initialContent={value}
      createNewItemFromQuery={item => item}
      createNewItemRenderer={(item: IChannel, _, handleClick) => (
        <MenuItem icon="add" key={item} text={item} onClick={handleClick} />
      )}
      inputValueRenderer={(item: IChannel) => item}
      itemRenderer={(item: IChannel, { handleClick }) => (
        <MenuItem icon="circle" key={item} text={item} onClick={handleClick} />
      )}
      onItemSelect={onItemSelect}
      query={value}
    />
  )
}
