import { Button, rem } from '@mantine/core';
import { image } from 'html2canvas/dist/types/css/types/image';
import React from 'react';

type StyledButtonProps = {
  app_theme: string;
  icon: React.ReactNode;
  loading: boolean;
  disabled: boolean;
  label: string;
  onClick: () => void;
};

function StyledButton({
  label,
  app_theme,
  icon,
  loading,
  disabled,
  onClick,
}: StyledButtonProps) {
  return (
    <Button
      leftIcon={icon}
      radius={'xl'}
      variant={app_theme !== 'dark' ? 'filled' : 'outline'}
      color="dark"
      disabled={disabled}
      size="lg"
      styles={(theme) => ({
        root: {
          backgroundColor: app_theme !== 'dark' ? '#000000' : '#ffff',
          border: 0,
          height: rem(42),
          paddingLeft: rem(20),
          paddingRight: rem(20),
          '&:hover': {
            backgroundColor: app_theme === 'dark' ? '#808080' : '#333333',
          },
        },
      })}
      onClick={onClick}
      loading={loading}
    >
      {label}
    </Button>
  );
}

export default StyledButton;
