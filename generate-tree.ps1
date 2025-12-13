#Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

$output = "project-structure.txt"
$excludeDirs = @("node_modules", ".next", ".github", ".git", ".vercel", "prisma", "dist", "build")

$script:result = @()

function Get-DirectoryTree {
    param (
        [string]$Path = ".",
        [int]$Level = 0,
        [int]$MaxLevel = 5,
        [string[]]$Exclude
    )
    
    if ($Level -gt $MaxLevel) { return }
    
    $indent = "  " * $Level
    $items = Get-ChildItem -Path $Path -ErrorAction SilentlyContinue
    
    foreach ($item in $items) {
        if ($Exclude -contains $item.Name) { continue }
        
        if ($item.PSIsContainer) {
            $script:result += "$indent|-- $($item.Name)/"
            Get-DirectoryTree -Path $item.FullName -Level ($Level + 1) -MaxLevel $MaxLevel -Exclude $Exclude
        } else {
            $script:result += "$indent|-- $($item.Name)"
        }
    }
}

Write-Host "Generating project structure..." -ForegroundColor Green

Get-DirectoryTree -MaxLevel 5 -Exclude $excludeDirs

$tree = "theorydeck/`n" + ($script:result -join "`n")

$tree | Out-File -FilePath $output -Encoding UTF8

Write-Host "Project structure saved to $output" -ForegroundColor Green
Write-Host "Excluded folders: $($excludeDirs -join ', ')" -ForegroundColor Yellow