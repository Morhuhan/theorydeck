#Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

Write-Host "Creating TheoryDeck project structure..." -ForegroundColor Green

$appDirs = @(
    "app\(auth)\login",
    "app\(auth)\register",
    "app\(main)\theories\[slug]\edit",
    "app\(main)\theories\new",
    "app\(main)\profile",
    "app\admin\reports",
    "app\admin\theories",
    "app\api\auth\[...nextauth]",
    "app\api\theories\[id]",
    "app\api\evidence-cards\[id]\vote",
    "app\api\comments\[id]",
    "app\api\reports\[id]"ы
)

foreach ($dir in $appDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$componentDirs = @(
    "components\ui",
    "components\theory",
    "components\evidence",
    "components\comment",
    "components\report",
    "components\layout",
    "components\auth",
    "components\shared"
)

foreach ($dir in $componentDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

$libDirs = @(
    "lib\auth",
    "lib\db",
    "lib\api",
    "lib\utils",
    "lib\hooks",
    "lib\constants"
)

foreach ($dir in $libDirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

New-Item -ItemType Directory -Force -Path "types" | Out-Null

$appFiles = @(
    "app\(auth)\layout.tsx",
    "app\(auth)\login\page.tsx",
    "app\(auth)\register\page.tsx",
    "app\(main)\layout.tsx",
    "app\(main)\page.tsx",
    "app\(main)\theories\[slug]\page.tsx",
    "app\(main)\theories\[slug]\edit\page.tsx",
    "app\(main)\theories\new\page.tsx",
    "app\(main)\profile\page.tsx",
    "app\admin\layout.tsx",
    "app\admin\reports\page.tsx",
    "app\admin\theories\page.tsx",
    "app\api\auth\[...nextauth]\route.ts",
    "app\api\theories\route.ts",
    "app\api\theories\[id]\route.ts",
    "app\api\evidence-cards\route.ts",
    "app\api\evidence-cards\[id]\route.ts",
    "app\api\evidence-cards\[id]\vote\route.ts",
    "app\api\comments\route.ts",
    "app\api\comments\[id]\route.ts",
    "app\api\reports\route.ts",
    "app\api\reports\[id]\route.ts",
    "app\layout.tsx",
    "app\error.tsx"
)

foreach ($file in $appFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Force -Path $file | Out-Null
    }
}

$componentFiles = @(
    "components\ui\button.tsx",
    "components\ui\card.tsx",
    "components\ui\dialog.tsx",
    "components\ui\tabs.tsx",
    "components\ui\badge.tsx",
    "components\ui\input.tsx",
    "components\ui\textarea.tsx",
    "components\ui\select.tsx",
    "components\ui\progress.tsx",
    
    "components\theory\TheoryCard.tsx",
    "components\theory\TheoryHeader.tsx",
    "components\theory\TheoryTLDR.tsx",
    "components\theory\ConfidenceBar.tsx",
    "components\theory\TheoryForm.tsx",
    "components\theory\TheoryFilters.tsx",
    
    "components\evidence\EvidenceCard.tsx",
    "components\evidence\EvidenceList.tsx",
    "components\evidence\EvidenceForm.tsx",
    "components\evidence\VoteButtons.tsx",
    "components\evidence\EvidenceSort.tsx",
    
    "components\comment\CommentList.tsx",
    "components\comment\CommentItem.tsx",
    "components\comment\CommentForm.tsx",
    
    "components\report\ReportButton.tsx",
    "components\report\ReportDialog.tsx",
    
    "components\layout\Header.tsx",
    "components\layout\Footer.tsx",
    "components\layout\Sidebar.tsx",
    
    "components\auth\LoginForm.tsx",
    "components\auth\RegisterForm.tsx",
    "components\auth\UserMenu.tsx",
    
    "components\shared\LoadingSpinner.tsx",
    "components\shared\ErrorMessage.tsx",
    "components\shared\EmptyState.tsx",
    "components\shared\TagBadge.tsx",
    "components\shared\StatusBadge.tsx",
    "components\shared\ConfirmDialog.tsx"
)

foreach ($file in $componentFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Force -Path $file | Out-Null
    }
}

$libFiles = @(
    "lib\auth\auth.config.ts",
    "lib\auth\auth.ts",
    "lib\auth\middleware.ts",
    
    "lib\db\prisma.ts",
    
    "lib\api\theories.ts",
    "lib\api\evidence.ts",
    "lib\api\votes.ts",
    "lib\api\comments.ts",
    "lib\api\reports.ts",
    
    "lib\utils\confidence.ts",
    "lib\utils\validation.ts",
    "lib\utils\formatting.ts",
    "lib\utils\slug.ts",
    "lib\utils\permissions.ts",
    
    "lib\hooks\useTheory.ts",
    "lib\hooks\useEvidenceCards.ts",
    "lib\hooks\useVote.ts",
    "lib\hooks\useComments.ts",
    "lib\hooks\useDebounce.ts",
    
    "lib\constants\vote-strengths.ts",
    "lib\constants\report-reasons.ts",
    "lib\constants\theory-statuses.ts"
)

foreach ($file in $libFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Force -Path $file | Out-Null
    }
}

$typeFiles = @(
    "types\index.ts",
    "types\theory.ts",
    "types\evidence.ts",
    "types\vote.ts",
    "types\comment.ts",
    "types\report.ts",
    "types\api.ts"
)

foreach ($file in $typeFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Force -Path $file | Out-Null
    }
}

Write-Host "`nProject structure created successfully!" -ForegroundColor Green
Write-Host "`nCreated directories:" -ForegroundColor Cyan
Write-Host "- app/ (with auth, main, admin, and api routes)"
Write-Host "- components/ (ui, theory, evidence, comment, report, layout, auth, shared)"
Write-Host "- lib/ (auth, db, api, utils, hooks, constants)"
Write-Host "- types/"

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Review the created structure"
Write-Host "2. Start implementing components"
Write-Host "3. Configure NextAuth in lib/auth/auth.config.ts"
Write-Host "4. Set up Prisma client in lib/db/prisma.ts"
Write-Host "5. Implement core business logic in lib/utils/"

Write-Host "`nDone!" -ForegroundColor Green