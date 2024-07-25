import React, { useState } from 'react';
import { theme } from "../../Styles/global";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import 'dayjs/locale/pt-br'; // Importa a localização desejada para o dayjs


function FieldSelect({ label, value, onChange, options }) {
  return (
    <FormControl variant="filled" sx={{ margin: '.7rem', borderRadius: '5px', width: 'inherit'}}>
      <InputLabel id={`label-${label}`}>{label}</InputLabel>
      <Select
        labelId={`label-${label}`}
        id={`select-${label}`}
        value={value}
        onChange={onChange}
        label={label}
        sx={{
            backgroundColor: '#EAE3D7',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.custom.main,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.custom.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.custom.main,
            },
            '& .MuiOutlinedInput-input': {
              backgroundColor: '#f5f5f5', //fundo
              color: theme.palette.custom.main,
            },
            '& .MuiSelect-selectMenu': {
              backgroundColor: '#fff',
              border: '1px solid #ced4da',
            },
            '& .MuiMenuItem-root': {
              backgroundColor: '#f5f5f5',
              color: '#3f51b5',
            },
            '& .MuiMenuItem-root:hover': {
              backgroundColor: '#e0e0e0',
            },
            fontFamily: theme.typography.fontFamily
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option} sx={{ padding: '10px', backgroundColor: '#e0e0e0' }}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default FieldSelect;
