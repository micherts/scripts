$emails = Get-Content .\emails.json | ConvertFrom-Json
$email = $emails.'account-requested'

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

aws ses create-template --cli-input-json "file://template-$($email.name).json"
aws ses update-template --cli-input-json "file://template-$($email.name).json"
aws ses list-templates 

$testEmail = [PSCustomObject]@{
    "Source"       = "HospoSure <hello@hosposure.com.au>"
    "Template"     = $email.name
    "Destination"  = [PSCustomObject]@{
        "ToAddresses" = @( "michael.roberts@hosposure.com.au", "micherts@me.com")
    }
    "TemplateData" = [PSCustomObject]@{
        name = "Michael"
        code = "1234" 
    } | ConvertTo-Json
}

aws ses send-templated-email --cli-input-json ($testEmail | ConvertTo-Json)

# Next steps
# Improve email templates
# Update stripeWebhook to include email actions
