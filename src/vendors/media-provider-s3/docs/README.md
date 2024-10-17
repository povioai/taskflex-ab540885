
<a name="readme-top"></a>

<!-- Project Logos -->
<p align="center">
  <span>
    <img style="height:64px" src="./assets/povio-logo-dark.png" alt="Povio Logo">
  </span>
  <span>
    <img style="height:64px" src="./assets/amazon-s3.png" alt="Amazon S3 Logo">
  </span>
</p>

<!-- Project Title -->
<h3 align="center">Robodev - Upload Media with S3</h3>

---

## Media Provider S3

Each media upload provider should implement the `MediaUploadProviderService` abstract class. The abstract class defines the following method: `generatePresignedUrl`.


## Table of Contents

- [Media Provider S3](#media-provider-s3)
- [Table of Contents](#table-of-contents)
- [Local Setup ](#local-setup-)
- [External Setup ](#external-setup-)
- [Config Variables Setup ](#config-variables-setup-)
- [Adjustments ](#adjustments-)
- [Multipart Upload ](#multipart-upload-)
- [Frontend Notes ](#frontend-notes-)
  - [Steps:](#steps)
  - [Diagram:](#diagram)
- [Links \& Resources ](#links--resources-)

## Local Setup <a name="local-setup"></a>

To use Local Stack S3 as your uploading, the following internal setup is required:

1. Startup the container with Local Stack S3 service.
   - Note: The docker compose with local stack service is already provided in the project and can be found [here](../../../../docker-compose.yml).
2. Create a new S3 bucket using the command `awslocal s3api create-bucket --bucket bucket_name`.
3. Provide the custom endpoint URL `AWS_ENDPOINT` in the config.
   - Note: The custom endpoint URL is the URL where the Local Stack S3 service is running.
   - Example: `http://localhost:4566`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## External Setup <a name="external-setup"></a>

To use S3 as your uploading service, the following external setup is required:

1. Create an AWS account on [Official Amazon Web Service Website][aws-services-official-website].
2. Create a new S3 bucket.
3. Configure the S3 bucket to your match your desired privacy and security policy.
   - Note: Keep in mind, upload method will be using presigned urls to allow content upload.
4. Copy the S3 `bucket_name`.
5. Prepare AWS account that has permissions to generate presigned URL using PUT method.
   - Note: This can possibly already be as part of CI/CD.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Config Variables Setup <a name="config-variables"></a>

To use upload media using S3, set the following config variables under `mediaPresignedUrl`:

- `region`
  - Description: The AWS region where your AWS resources are hosted or where you want your AWS SDKs and services to operate.
  - Example: `us-east-1`
- `accessKeyId`
  - Description: The Access Key ID is used to identify your AWS account when making API requests. It is associated with your AWS IAM (Identity and Access Management) user or role.
  - Example: `your_access_id`
- `secretAccessKey
  - Description: The Secret Access Key is a long, secret key that is used in combination with the Access Key ID to authenticate your AWS API requests.
  - Example: `your_secret_access_key`
- `bucket`
  - Description: The name of an AWS S3 (Simple Storage Service) bucket where you store and manage objects, such as files and data.
  - Example: `your_bucket_name`
- `apiEndpoint` (optional)
  - Description: AWS endpoint variable allows you to specify a custom endpoint URL for AWS services.
  - Example: `http://localhost:4567`
  - Notes: This variable is optional.
    - It is used when doing local setup.
    - It is omitted in production setup.
- `uploadFolder`
  - Description: The folder where the media will be uploaded.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Adjustments <a name="template-adjustments"></a>

1. In [upload-media.constants.ts](../upload-media/upload-media.constants.ts) ensure constant `mediaUploadMethod` is set to `UploadMediaMethod.PUT`.

By swiching to `UploadMediaMethod.PUT`, all references and dependencies will automatically switch to using upload media using S3 PUT method.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Multipart Upload <a name="multipart-upload"></a>

Multipart upload allows you to upload a single object as a set of parts.

It consists of the following steps:

1. Initiate Multipart Upload
2. Upload Parts
3. Complete Multipart Upload
   - Notes: After you initiate a multipart upload, Amazon S3 retains all the parts until you either complete or stop the upload. Throughout its lifetime, you are billed for all storage, bandwidth, and requests for this multipart upload and its associated parts.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Frontend Notes <a name="notes"></a>

### Steps:
1. Request Pre-signed URL from Backend `GET /media-presigned-url`
2. Upload media to the requested Pre-signed URL using the method the backend returns.
   - Command: `curl -X PUT -T <file> <presigned-url>`
3. Update the profilePictureId with the returned media id from the first request.

### Diagram:
<img src="./assets/fe-upload-media.png" height="400px">


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Links & Resources <a name="links-and-resources"></a>

- [Presigned Url](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
- [Multipart Upload Process](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html#mpu-process)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Readme Variables -->

[aws-services-official-website]: https://aws.amazon.com/
