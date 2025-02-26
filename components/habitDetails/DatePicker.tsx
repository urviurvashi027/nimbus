import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface DatePickerProps {
  visible: boolean;
  selectedDateValue: Date;
  onConfirmDate: (selectedDate: Date) => void;
  onClose: () => void;
  minimumDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = (props) => {
  const { onConfirmDate, visible, minimumDate, selectedDateValue, onClose } =
    props;
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const hideDatePicker = () => {
    setPickerVisible(false);
    onClose();
  };

  const handleConfirm = (date: any) => {
    hideDatePicker();
    setSelectedDate(date);
    onConfirmDate(date);
  };

  useEffect(() => {
    setPickerVisible(visible);
  }, []);

  return (
    // <View>
    <DateTimePickerModal
      isVisible={visible}
      mode="date"
      onConfirm={handleConfirm}
      onCancel={hideDatePicker}
      minimumDate={minimumDate}
      // buttonTextColorIOS="red"
    />
    // </View>
  );
};

export default DatePicker;
