# Configure image uploading 
# https://haydnjmorris.medium.com/uploading-photos-to-aws-s3-getting-started-with-cognito-and-iam-c96ba5b5496d
# https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album.html

$envs = Get-Content "../env.json" | ConvertFrom-Json
$env = $envs.stage

# Set-AWSCredential -ProfileName AWS_CLI
$region = $envs.region
$app = 'hosposure-recipe-images'

$env = $envs.stage

$adminRoleArn = (Get-CGIPGroup -UserPoolId $env.cognito.userPoolId -GroupName 'Admin').RoleArn
$adminRoleName = $adminRoleArn.split("/")[-1]
$identityPoolRoleArn = (Get-CGIIdentityPoolRole -IdentityPoolId $env.cognito.identityPoolId).Roles.authenticated
$identityPoolRoleName = $identityPoolRoleArn.split("/")[-1]
$rolePolicyDoc = @{
    Version   = "2012-10-17"; 
    Statement = @(
        @{ 
            Effect   = "Allow"; 
            Action   = @("mobileanalytics:PutEvents", "cognito-sync:*", "cognito-identity:*"); 
            Resource = @("*")
        },
        @{ 
            Effect   = "Allow"; 
            Action   = @("s3:PutObject", "s3:PutObjectAcl", "s3:DeleteObject", "s3:GetObject"); 
            Resource = @("arn:aws:s3:::$app/*")
        }
    ) 
}
$rolePolicy = New-IAMPolicy -PolicyName "$app-policy-$($env.name)" -PolicyDocument ($rolePolicyDoc | ConvertTo-Json -Depth 5)
# $rolePolicy = Get-IAMPolicyList | Where-Object {$_.PolicyName -eq "$app-policy-$($env.name)"}
# Remove-IAMPolicy -PolicyArn $rolePolicy.Arn -Force
Register-IAMRolePolicy -RoleName $identityPoolRoleName -PolicyArn $rolePolicy.Arn
Register-IAMRolePolicy -RoleName $adminRoleName -PolicyArn $rolePolicy.Arn
# Unregister-IAMRolePolicy -RoleName $identityPoolRoleName -PolicyArn $rolePolicy.Arn

New-S3Bucket -Region $region -BucketName "$app-$($env.name)"
# Remove-S3Bucket -Region $region -BucketName $app -Force -Verbose
$bucketPolicy = @{
    Version   = "2012-10-17"; 
    Id        = "$app-S3-bucket-policy-$($env.name)"; 
    Statement = @{
        Effect    = "Allow"; 
        Principal = @{
            AWS = @($identityPoolRoleArn, $adminRoleArn)
        }; 
        Action    = @("s3:PutObject", "s3:PutObjectAcl", "s3:DeleteObject", "s3:GetObject"); 
        Resource  = @("arn:aws:s3:::$app-$($env.name)/*") 
    } 
}
Write-S3BucketPolicy -BucketName "$app-$($env.name)" -Policy ($bucketPolicy | ConvertTo-Json -Depth 5)
$CORSConfigRule = @(@{ 
        AllowedHeaders = @("*"); 
        AllowedMethods = @("PUT", "HEAD", "DELETE", "GET"); 
        AllowedOrigins = $env.s3.allowedOrigins; 
        MaxAgeSeconds  = 3000 
    })
Write-S3CORSConfiguration -BucketName "$app-$($env.name)" -Configuration_Rule $CORSConfigRule

