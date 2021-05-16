import React from 'react';
import TextButton from '.';

export default {
  title: 'Components/Buttons/TextButton',
  component: TextButton,
};

const Template = (args) => <TextButton {...args} />;

export const Default = Template.bind({});

Default.args = {
  children: '다음',
};
