// src/components/dashboard/customer/customers-filters.tsx
import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface CustomersFiltersProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export function CustomersFilters({ searchTerm, onSearch }: CustomersFiltersProps): React.JSX.Element {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        placeholder="Search customer"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />
    </Card>
  );
}
