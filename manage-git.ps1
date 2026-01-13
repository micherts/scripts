$project = "scripts"
$wl = "${Home}\Documents\Code\$project"

# Clone 
Set-Location $Home\Documents\Code
git clone git@github.com:micherts/$project.git

# Update
Set-Location $wl
git add .
git commit -m 'updated email templates for additional-user-added-venue'
git push origin master
