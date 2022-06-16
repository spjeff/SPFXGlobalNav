# Prompt
$siteUrl = Read-Host -Prompt "Enter the site url"
if ($siteUrl -like '*ADFS_SITE_URL.com*') {
  Connect-PnPOnline -url $siteUrl -UseWebLogin
}
else {
  Connect-PnPOnline -url $siteUrl -Credentials (Get-Credential)
}
function UpdateFile ($localFile, $file, $folder) {
  $currentSiteServerRelativeUrl = Get-PnPSite -Includes ServerRelativeUrl | % { $_.ServerRelativeUrl }
  $currentSiteServerRelativeUrl = $currentSiteServerRelativeUrl.TrimEnd("/")
  Write-Host "File Located" -ForegroundColor Green
  Write-Host "Deploy Style Library Assets" -ForegroundColor Green
  Set-PnPFileCheckedOut -Url "$currentSiteServerRelativeUrl/$folder/$file"
  Add-PnPFile -Path $localFile -Folder $folder | Out-Null
  Set-PnPFileCheckedIn -Url "$currentSiteServerRelativeUrl/$folder/$file"
  Write-Host "Update Complete" -ForegroundColor Blue
}

# Main
$currentSiteServerRelativeUrl = Get-PnPSite -Includes ServerRelativeUrl | % { $_.ServerRelativeUrl }
$currentSiteServerRelativeUrl = $currentSiteServerRelativeUrl.TrimEnd("/")
$file = "top-navigation.js"
$folder = "Style Library/spfx-global-nav/js"
UpdateFile "./$file" $file $folder
Add-PnPJavaScriptLink -Name "topNavigation" -Url "$currentSiteServerRelativeUrl/$folder/$file" -Scope "Site"
# Remove-PnPJavaScriptLink -Identity "topNavigation" -Scope Site -Force
