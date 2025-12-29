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
