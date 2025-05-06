import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
`;

const CheckBoxStyle = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid #838080;
  appearance: none;
  cursor: pointer;
  background: ${props => (props.checked ? '#ff9900' : '')};

  &:checked::before {
    content: '✔︎';
    display: block;
    text-align: center;
    color: #ffffff;
  }
`;

const LabelText = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20.27px;
  text-align: left;
  color: #07000280;
`;

export function CheckBox({
  label,
  isLoading = false,
  onChange,
}: {
  label: string;
  isLoading?: boolean;
  onChange: (checked: boolean) => void;
}) {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
    onChange(checked);
  };

  return (
    <Container>
      <CheckBoxStyle>
        <CheckboxInput
          checked={isChecked}
          type="checkbox"
          id="checkbox"
          disabled={isLoading}
          onChange={e => handleChange(e.target.checked)}
        />
        <LabelText>{label}</LabelText>
      </CheckBoxStyle>
    </Container>
  );
}
