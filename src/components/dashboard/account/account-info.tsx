import * as React from 'react';
import { auth } from '../../../../server/lib/firebase';  // Add this import
import { db, storage } from '../../../../server/lib/firebase';
import { updateDoc, doc } from 'firebase/firestore'; // Adjust this import path as needed
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [avatar, setAvatar] = React.useState(user.avatar || '/assets/avatar.png');

  const fullName = `${user.firstName} ${user.lastName}`;
  const formattedDate = new Date(user.createdAt).toLocaleString();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };



  // ... other imports and component code ...

  const handleUpload = async (): Promise<void> => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const userId = user.uid;
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }

    if (!imageFile || !storage || !db) {
      console.error("No image file selected or storage/db is not initialized");
      return;
    }

    try {
      setUploading(true);
      const storageRef = ref(storage, `avatars/${userId}/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error("Error uploading image: ", error);
          setUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setAvatar(downloadURL);

            // Update user document in Firestore
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { avatar: downloadURL });

            console.log("Profile updated successfully");
          } catch (error) {
            console.error("Error updating Firestore: ", error);
          } finally {
            setUploading(false);
            setImageFile(null);
          }
        }
      );
    } catch (error) {
      console.error("Error in handleUpload: ", error);
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={avatar} sx={{ height: '80px', width: '80px' }} />
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
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="raised-button-file">
          <Button component="span" fullWidth variant="text" disabled={uploading}>
            {imageFile ? 'Change Image' : 'Upload picture'}
          </Button>
        </label>
        {imageFile && (
          <Button
            fullWidth
            variant="contained"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Confirm Upload'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
