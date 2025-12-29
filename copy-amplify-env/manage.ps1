# Delete branch
$appId = "d3b1lw5a6mn67p"
$branchToDelete = "staging"
amplify env remove $branchToDelete
# Delete git branch next
aws amplify list-backend-environments --app-id $appId
aws amplify delete-backend-environment --app-id $appId --environment-name $branchToDelete

# Enable PITR 
$tables = Get-DDBTableList | Where-Object { $_ -like "*stage*" }
$tables | % {Update-DDBContinuousBackup -TableName $_ -PointInTimeRecoverySpecification_PointInTimeRecoveryEnabled $true}

# Delete tables 
$tables = Get-DDBTableList | Where-Object { $_ -like "*staging*" }
$tables | % {Remove-DDBTable -TableName $_ -Force}

# Set lambda trigger for Cognito User Pool
$envs = Get-Content "../env.json" | ConvertFrom-Json
$env = $envs.stage
$poolConfig = aws cognito-idp describe-user-pool --user-pool-id $($env.cognito.userPoolId) --query 'UserPool.{AutoVerifiedAttributes:AutoVerifiedAttributes,AliasAttributes:AliasAttributes,UsernameAttributes:UsernameAttributes}' --output json | ConvertFrom-Json
aws cognito-idp update-user-pool --user-pool-id $($env.cognito.userPoolId) --lambda-config PostConfirmation=$($env.lambda.accountVerifiedArn) --auto-verified-attributes $poolConfig.AutoVerifiedAttributes
