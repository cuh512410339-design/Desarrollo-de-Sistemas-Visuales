param(
  [ValidateSet("local","docker","all","help")]
  [string]$Mode = "help"
)

switch ($Mode) {
  "local" {
    Write-Output "Running server tests locally..."
    npm run -w server test
    break
  }
  "docker" {
    Write-Output "Running server tests inside Docker..."
    docker compose run --rm server npm test
    break
  }
  "all" {
    Write-Output "Running local tests then Docker tests..."
    npm run -w server test
    docker compose run --rm server npm test
    break
  }
  default {
    Write-Output "Usage: .\run-tests.ps1 -Mode <local|docker|all>"
  }
}