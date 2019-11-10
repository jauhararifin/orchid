import React from 'react';
import { MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';

export type ICategory = string;

export interface CategoryInputProps {
  name: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  onItemSelect: (item: ICategory, event?: React.SyntheticEvent<HTMLElement>) => void;
}

export const CategoryInput: React.FC<CategoryInputProps> = ({ name, onBlur, placeholder, onItemSelect }) => {
  const CategorySuggest = Suggest.ofType<ICategory>();
  const commonCategories = ['Food', 'Transportation', 'Utilities', 'Entertaiment', 'Rent', 'Vacation', 'Other'];
  return (
    <CategorySuggest
      fill={true}
      inputProps={{ name, placeholder, onBlur }}
      items={commonCategories}
      inputValueRenderer={(item: ICategory) => item}
      itemRenderer={(item: ICategory, { handleClick }) => <MenuItem key={item} text={item} onClick={handleClick} />}
      onItemSelect={onItemSelect}
    />
  );
};
