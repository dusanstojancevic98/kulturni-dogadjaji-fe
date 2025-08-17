import { Box } from "@mui/material";
import {
  DatePicker,
  type DatePickerProps,
} from "@mui/x-date-pickers/DatePicker";
import {
  DateTimePicker,
  type DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";
import {
  TimePicker,
  type TimePickerProps,
} from "@mui/x-date-pickers/TimePicker";
import { useState, type FC } from "react";

type Props =
  | (DatePickerProps & { pickerType: "date" })
  | (TimePickerProps & { pickerType: "time" })
  | (DateTimePickerProps & { pickerType?: "date-time" | undefined });

export const CustomDatePicker: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);

  const restProps = {
    open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    slotProps: {
      textField: {
        ...props.slotProps?.textField,
        fullWidth: true,
        onClick: () => setOpen(true),
        inputProps: { readOnly: true },
      },
      openPickerButton: { onClick: () => setOpen(true) },
    },
  };

  const Component =
    props.pickerType === "date" ? (
      <DatePicker {...props} {...restProps} />
    ) : props.pickerType === "time" ? (
      <TimePicker {...props} {...restProps} />
    ) : (
      <DateTimePicker {...props} {...restProps} />
    );

  return (
    <Box onClick={() => setOpen(true)} sx={{ cursor: "text" }}>
      {Component}
    </Box>
  );
};
