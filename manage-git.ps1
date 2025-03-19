$project = "scripts"
$wl = "${Home}\Documents\Code\$project"

# Clone 
Set-Location $Home\Documents\Code
git clone git@github.com:micherts/$project.git

# Update
Set-Location $wl
git add .
git commit -m 'updated email template for error-report to left align and remove customer items'
git push origin master
