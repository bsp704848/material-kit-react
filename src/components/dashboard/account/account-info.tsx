// src/components/dashboard/account/account-info.tsx

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface AccountInfoProps {
  user: {
    firstName: string;
    lastName: string;
    avatar?: string;
    role: string;
    createdAt: string;
  };
}

export function AccountInfo({ user }: AccountInfoProps): React.JSX.Element {
  const fullName = `${user.firstName} ${user.lastName}`;
  const formattedDate = new Date(user.createdAt).toLocaleString();

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={user.avatar || '/assets/avatar.png'} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{fullName}</Typography>
            <Typography color="text.secondary" variant="body2">
              Role: {user.role}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Joined: {formattedDate}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button fullWidth variant="text">
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
}
