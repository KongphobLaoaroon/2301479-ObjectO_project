from google.cloud import storage
from google.oauth2 import service_account
from mimetypes import guess_type

class GoogleCloud :
    def __init__(self, bucket_name, credentials_file) -> None:
        self.bucket_name = bucket_name
        self.credentials = service_account.Credentials.from_service_account_file(credentials_file)
        self.client = storage.Client(credentials=self.credentials)

    def upload_image(self, image_path, blob_name):
        """
        Uploads an image file to Google Cloud Storage.

        Args:
            image_path (str): The path to the image file to upload.
            blob_name (str): The name of the blob in the bucket.

        Returns:
            bool: True if the upload was successful, False otherwise.
        """
        bucket = self.client.get_bucket(self.bucket_name)
        blob = bucket.blob(blob_name)

        # Set the content type based on the file extension
        content_type, _ = guess_type(image_path)
        if not content_type:
            content_type = "application/octet-stream"

        try:
            blob.upload_from_filename(image_path, content_type=content_type)
            print(f"Image {image_path} uploaded to {blob_name}.")
            blob.make_public()
            return blob.public_url
        except Exception as e:
            print(f"Failed to upload image: {e}")
            return False
        
    def delete_image(self, blob_name):
        """
        Deletes an image from Google Cloud Storage.

        Args:
            blob_name (str): The name of the blob in the bucket to delete.

        Returns:
            bool: True if the deletion was successful, False otherwise.
        """
        bucket = self.client.get_bucket(self.bucket_name)
        blob = bucket.blob(blob_name)

        try:
            blob.delete()
            print(f"Image {blob_name} deleted.")
            return True
        except Exception as e:
            print(f"Failed to delete image: {e}")
            return False