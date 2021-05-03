import React from 'react';
import { CardCompanyOption } from '../';
import { CARD_COMPANY } from '../../constants';
import './style.css';

export default function CardCompanySelection({ onCloseModal, setCardCompany }) {
  return (
    <div className="card-company-selection">
      {Object.entries(CARD_COMPANY).map(([key, { NAME, COLOR }]) => (
        <CardCompanyOption
          key={key}
          name={NAME}
          color={COLOR}
          onClick={() => {
            setCardCompany(key);
            onCloseModal();
          }}
        />
      ))}
    </div>
  );
}
