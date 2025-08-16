$project = "scripts"
$wl = "${Home}\Documents\Code\$project"

# Clone 
Set-Location $Home\Documents\Code
git clone git@github.com:micherts/$project.git

# Update
Set-Location $wl
git add .
git commit -m 'removed additional-user-invitation email template, updated additional-user-added-venue email template'
git push origin master
