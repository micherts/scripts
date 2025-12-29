$project = "scripts"
$wl = "${Home}\Documents\Code\$project"

# Clone 
Set-Location $Home\Documents\Code
git clone git@github.com:micherts/$project.git

# Update
Set-Location $wl
git add .
git commit -m 'moved manage-s3 upload script to s3upload folder, updated env.json'
git push origin master
