
import { supabase } from './supabaseClient';

/**
 * Uploads a file to a specified Supabase Storage bucket and returns the public URL.
 * @param file The file to upload.
 * @param bucketName The name of the Supabase Storage bucket (e.g., 'sermons', 'events').
 * @returns The public URL of the uploaded file.
 */
export async function uploadFileAndGetUrl(file: File, bucketName: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error('Could not get public URL for uploaded file.');
  }

  return data.publicUrl;
}
