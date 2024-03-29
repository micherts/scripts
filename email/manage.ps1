$name = "account-verified"
$subject = "We're here to help you get started"

# Use Stripo to create and export the HTML template and save as template-$name.html.
# Manually create the txt template and save as template-$name.txt.

$template = [PSCustomObject]@{
    "Template" = [PSCustomObject]@{
        "TemplateName" = $name
        "SubjectPart"  = $subject
        "HtmlPart"     = Get-Content ".\template-$name.html" -Raw
        "TextPart"     = Get-Content ".\template-$name.txt" -Raw
    }
}

$template | ConvertTo-Json | Out-File ".\template-$name.json"

aws ses create-template --cli-input-json "file://template-$name.json"
aws ses update-template --cli-input-json "file://template-$name.json"
aws ses list-templates

$testEmail = [PSCustomObject]@{
    "Source"       = "HospoSure <hello@hosposure.com.au>"
    "Template"     = "$name"
    "Destination"  = [PSCustomObject]@{
        "ToAddresses" = @( "michael.roberts@hosposure.com.au")
    }
    "TemplateData" = [PSCustomObject]@{name = "Michael" } | ConvertTo-Json
}

aws ses send-templated-email --cli-input-json ($testEmail | ConvertTo-Json)
