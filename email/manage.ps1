$project = "scripts\email"
$wl = "${Home}\Documents\Code\$project"
Set-Location $wl

# Note: txt templates are not configured to use the 11ty variables as I couldn't get it to work for txt files. So all txt templates must be manually updated.
npm start

$emails = Get-Content .\emails.json | ConvertFrom-Json

# Use Stripo or manually to create and export the HTML template and save as template-$name.html.
# Manually create the txt template and save as template-$name.txt.

# $email = $emails.'verification-code'
# $email = $emails.'new-user-account-verified'
# $email = $emails.'subscription-decreased'
# $email = $emails.'subscription-expiration-warning'
# $email = $emails.'error-report'
# $email = $emails.'additional-user-invitation'
# $email = $emails.'additional-user-added-venue'
# $email = $emails.'additional-user-removed-venue'
$email = $emails.'demo-nudge'

$emails.PSObject.Properties | ForEach-Object { $email = $_.value;
    @{
        "Template" = @{
            "TemplateName" = $email.name
            "SubjectPart"  = $email.subject
            "HtmlPart"     = Get-Content ".\out\template-$($email.name).html" -Raw
            "TextPart"     = Get-Content ".\out\template-$($email.name).txt" -Raw
        }
    } | ConvertTo-Json | Out-File ".\json\template-$($email.name).json" -verbose
}

$emails.PSObject.Properties | ForEach-Object { $email = $_.value;
    # aws ses create-template --cli-input-json "file://json/template-$($email.name).json"
     aws ses update-template --cli-input-json "file://json/template-$($email.name).json"
    # aws ses list-templates 
    # aws ses delete-template --template-name $email.name
}

$emails.PSObject.Properties | ForEach-Object { $email = $_.value;
    aws ses send-templated-email --cli-input-json ( @{
            "Source"       = "HospoSure <hello@hosposure.com.au>"
            "Template"     = $email.name
            "Destination"  = @{
                # "ToAddresses" = @("michael.roberts@hosposure.com.au", "micherts@me.com")
                "ToAddresses" = @("michael.roberts@hosposure.com.au")
                # "ToAddresses" = @("micherts@me.com")
                # "ToAddresses" = @("tim.noye@hosposure.com.au")
            }
            "TemplateData" = @{
                # name     = "Michael"
                name     = "Tim"
                code     = "1234" 
                username = "youremail@email.com"
                date     = "Friday 7-Jun-24"
                email    = "test@email.com"
                action   = "I don't know what I did!"
                error    = "This is a big error."
                venue    = "Test Venue"
                owner    = "Test Owner"
            } | ConvertTo-Json
        } | ConvertTo-Json);
    # Start-Sleep -Seconds 5;
}

