# Python Scripts
# Tables & Streams
$env = Get-Content .\env.json | ConvertFrom-Json

# DynamoDB Restore
# DynamoDB console: restore to new table
# Copy from new table to existing table
pip install boto
New-Item -Path Env: -Name AWS_DEFAULT_REGION -Value ap-southeast-2 
New-Item -Path Env: -Name DISABLE_CREATION -Value true

$i = 4 # Need to update below to use $env var
For ($i = 0; $i -lt 12; $i++) {
    $Source = $Staging[$i].tn
    $Destination = $Prod[$i].tn
    & "C:\Python310\python.exe" "C:\Users\Administrator\Documents\Python\dynamodb-copy-table\dynamodb-copy-table.py" $Source $Destination
}


# DynamoDB Table Backfill https://docs.amplify.aws/cli/graphql/troubleshooting/#backfill-opensearch-index-from-dynamodb-table
pip3 install boto3

$selectedEnv = $env.prod
#Backfill all @searchable tables
$selectedEnv.ops.PSObject.Properties.Value | % { & python ".\ddb_to_es.py" --rn 'ap-southeast-2' --lf $selectedEnv.config.streamingLambda --tn $_.tn --esarn $_.esarn }
#Backfill selected table
$selectedTable = "operation"
$selectedEnv.ops.$selectedTable | % { & python ".\ddb_to_es.py" --rn 'ap-southeast-2' --lf $selectedEnv.config.streamingLambda --tn $_.tn --esarn $_.esarn }
# if lambda errors, see https://github.com/aws-amplify/amplify-category-api/issues/1217, remove _type parameter from 3 locations in the lambda code
