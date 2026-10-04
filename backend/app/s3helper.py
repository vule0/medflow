import boto3
from botocore.exceptions import ClientError

S3_BUCKET = "medflow-service-reports"
AWS_REGION = "us-east-1"

s3_client = boto3.client("s3", region_name=AWS_REGION)


async def upload_report(file, file_key: str):
    try:
        contents = await file.read()
        s3_client.put_object(
            Bucket=S3_BUCKET,
            Key=file_key,
            Body=contents,
            ContentType=file.content_type
        )

        return (f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{file_key}")

    except ClientError as error:
        raise error
    
    


def delete_report(file_key: str):
    try:
        s3_client.delete_object(Bucket=S3_BUCKET, Key=file_key,)
    except ClientError as error:
        raise error