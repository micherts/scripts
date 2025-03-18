# Clone 
Set-Location $Home\Documents\Code
git clone git@github.com:micherts/scripts.git

# Update
Set-Location $Home\Documents\Code\scripts
git add .
git commit -m 'updated email template for error-report'
git push origin master
