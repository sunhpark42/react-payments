import React from 'react';
import { Input } from '../../../components';
import { CARD } from '../../../constants';
import useCheckValidity from '../../../hooks/useCheckValidity';
import { cardSerialNumberFormatter } from '../../../utils/formatter';
import { isValidSerialNumber } from './../validator';

const SerialNumberInput = ({ number, company, setInput, onSetModalContents, forwardRef }) => {
  const [error, setError, checkValidity] = useCheckValidity(
    isValidSerialNumber,
    number,
    '올바른 카드번호를 입력하세요'
  );

  const offsetByInputType = {
    deleteContentBackward: -1,
    insertText: 1,
  };

  const getOffset = (inputType, selectionStart) => {
    if (inputType === 'insertText') {
      return selectionStart !== 0 && selectionStart % (CARD.SERIAL_NUMBER_UNIT_LENGTH + 1) === 0
        ? offsetByInputType[inputType]
        : 0;
    }

    if (inputType === 'deleteContentBackward') {
      return selectionStart !== 0 &&
        (selectionStart + 1) % (CARD.SERIAL_NUMBER_UNIT_LENGTH + 1) === 0
        ? offsetByInputType[inputType]
        : 0;
    }

    return 0;
  };

  const currentSerialNumberByInputType = {
    deleteContentBackward: (serialIndex) => {
      return number.slice(0, serialIndex - 1) + number.slice(serialIndex);
    },
    insertText: (serialIndex, insertKey) => {
      return number.slice(0, serialIndex) + insertKey + number.slice(serialIndex);
    },
    insertFromPaste: () => {
      throw new Error('붙여 넣기는 할 수 없습니다.');
    },
  };

  const onChange = (event) => {
    const inputKey = event.nativeEvent.data;
    const inputValue = event.target.value.replaceAll('-', '');

    if (isNaN(inputKey)) {
      event.target.value = cardSerialNumberFormatter(number);
      return;
    }

    const inputType = event.nativeEvent.inputType;
    const selectionStart = event.target.selectionStart;
    const offset = getOffset(inputType, selectionStart);
    const currentLocation = selectionStart + offset;

    try {
      const serialIndex =
        currentLocation -
        Math.floor(currentLocation / (CARD.SERIAL_NUMBER_UNIT_LENGTH + 1)) -
        offsetByInputType[inputType];
      const currentSerialNumber = currentSerialNumberByInputType[inputType](serialIndex, inputKey);
      const value = cardSerialNumberFormatter(currentSerialNumber);

      event.target.value = value;

      setInput('number', currentSerialNumber);

      event.target.setSelectionRange(currentLocation, currentLocation);

      if (inputValue.length === CARD.SERIAL_ID_CODE_LENGTH) {
        forwardRef.current.blur();
        onSetModalContents('cardSelection');
      }

      if (company && inputValue.length < CARD.SERIAL_ID_CODE_LENGTH) {
        setInput('number', '');
      }
    } catch (error) {
      setInput('number', '');
      event.target.value = number;
      setError(error.message);
    }
  };

  const onCompanySelectModalOpen = () => {
    if (!company && number.length === CARD.SERIAL_ID_CODE_LENGTH) {
      forwardRef.current.blur();
      onSetModalContents('cardSelection');
    }
  };

  return (
    <Input
      type="tel"
      label="카드번호"
      inputStyle={{ width: '100%' }}
      maxLength="19"
      onChange={onChange}
      onFocus={onCompanySelectModalOpen}
      onBlur={checkValidity}
      forwardRef={forwardRef}
      inputMode="numeric"
      textAlign="center"
      errorMessage={error}
    />
  );
};

export default SerialNumberInput;
