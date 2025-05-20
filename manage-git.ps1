$project = "scripts"
$wl = "${Home}\Documents\Code\$project"

# Clone 
Set-Location $Home\Documents\Code
git clone git@github.com:micherts/$project.git

# Update
Set-Location $wl
git add .
git commit -m 'updated node functions deleteSubscription to remove all memberships instead of just the first.'
git push origin master
