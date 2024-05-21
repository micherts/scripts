$emails = Get-Content .\emails.json | ConvertFrom-Json
$email = $emails.'verification-code'
# $email = $emails.'account-verified'
# $email = $emails.'subscription-started'

# Use Stripo to create and export the HTML template and save as template-$name.html.
# Manually create the txt template and save as template-$name.txt.

$template = [PSCustomObject]@{
    "Template" = [PSCustomObject]@{
        "TemplateName" = $email.name
        "SubjectPart"  = $email.subject
        "HtmlPart"     = Get-Content ".\template-$($email.name).html" -Raw
        "TextPart"     = Get-Content ".\template-$($email.name).txt" -Raw
    }
}

$template | ConvertTo-Json | Out-File ".\template-$($email.name).json"

#aws ses create-template --cli-input-json "file://template-$($email.name).json"
aws ses update-template --cli-input-json "file://template-$($email.name).json"
#aws ses list-templates 
#aws ses delete-template --template-name $email.name

$testEmail = [PSCustomObject]@{
    "Source"       = "HospoSure <hello@hosposure.com.au>"
    "Template"     = $email.name
    "Destination"  = [PSCustomObject]@{
        "ToAddresses" = @( "michael.roberts@hosposure.com.au", "micherts@me.com")
        # "ToAddresses" = @( "tim.noye@hosposure.com.au")
    }
    "TemplateData" = [PSCustomObject]@{
        # name     = "Michael"
        name     = "Tim"
        code     = "1234" 
        username = "youremail@email.com"
    } | ConvertTo-Json
}

aws ses send-templated-email --cli-input-json ($testEmail | ConvertTo-Json)

# Next steps
# Format account-verified template
# Update stripeWebhook to include email actions
