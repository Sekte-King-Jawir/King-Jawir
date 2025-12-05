#!/usr/bin/env pwsh
# Test Seller Authentication & Authorization
# Requirements: PowerShell, curl, jq (optional for JSON formatting)

$BASE_URL = "http://localhost:4101"
$SELLER_EMAIL = "testseller-$(Get-Random)@example.com"
$CUSTOMER_EMAIL = "testcustomer-$(Get-Random)@example.com"
$PASSWORD = "password123"
$COOKIES_SELLER = "cookies-seller.txt"
$COOKIES_CUSTOMER = "cookies-customer.txt"

Write-Host "`n=== SELLER AUTHENTICATION TESTS ===" -ForegroundColor Cyan

# Test 1: Unauthorized Access (No Token)
Write-Host "`n[Test 1] GET /api/seller/products without token (expect 401)..." -ForegroundColor Yellow
$response = Invoke-WebRequest -Uri "$BASE_URL/api/seller/products" -Method GET -SkipHttpErrorCheck
Write-Host "Status: $($response.StatusCode) - " -NoNewline
if ($response.StatusCode -eq 401) {
    Write-Host "✓ PASS" -ForegroundColor Green
    Write-Host "Response: $($response.Content)"
} else {
    Write-Host "✗ FAIL (expected 401)" -ForegroundColor Red
}

# Test 2: Register Seller
Write-Host "`n[Test 2] Register new seller..." -ForegroundColor Yellow
$registerPayload = @{
    email = $SELLER_EMAIL
    password = $PASSWORD
    name = "Test Seller"
    storeName = "Test Store"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/api/seller/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $registerPayload `
    -SkipHttpErrorCheck

Write-Host "Status: $($response.StatusCode) - " -NoNewline
if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
    Write-Host "✓ PASS" -ForegroundColor Green
    $registerData = $response.Content | ConvertFrom-Json
    Write-Host "Seller ID: $($registerData.data.user.id)"
    Write-Host "Store: $($registerData.data.store.name) ($($registerData.data.store.slug))"
} else {
    Write-Host "✗ FAIL" -ForegroundColor Red
    Write-Host "Response: $($response.Content)"
}

# Test 3: Login Seller
Write-Host "`n[Test 3] Login as seller..." -ForegroundColor Yellow
$loginPayload = @{
    email = $SELLER_EMAIL
    password = $PASSWORD
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/seller/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginPayload `
        -SessionVariable 'sellerSession' `
        -SkipHttpErrorCheck

    Write-Host "Status: $($response.StatusCode) - " -NoNewline
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ PASS" -ForegroundColor Green
        $loginData = $response.Content | ConvertFrom-Json
        Write-Host "Access Token: $($loginData.data.accessToken.substring(0, 20))..."
    } else {
        Write-Host "✗ FAIL" -ForegroundColor Red
        Write-Host "Response: $($response.Content)"
    }
} catch {
    Write-Host "✗ FAIL (Exception: $($_.Exception.Message))" -ForegroundColor Red
}

# Test 4: Access Protected Endpoint as Seller (expect 200)
Write-Host "`n[Test 4] GET /api/seller/products as seller (expect 200)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/seller/products" `
        -Method GET `
        -WebSession $sellerSession `
        -SkipHttpErrorCheck

    Write-Host "Status: $($response.StatusCode) - " -NoNewline
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ PASS" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Products: $($data.data.length) items"
    } else {
        Write-Host "✗ FAIL (expected 200)" -ForegroundColor Red
        Write-Host "Response: $($response.Content)"
    }
} catch {
    Write-Host "✗ FAIL (Exception: $($_.Exception.Message))" -ForegroundColor Red
}

# Test 5: Get Seller Profile
Write-Host "`n[Test 5] GET /api/seller/auth/me (expect 200)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/seller/auth/me" `
        -Method GET `
        -WebSession $sellerSession `
        -SkipHttpErrorCheck

    Write-Host "Status: $($response.StatusCode) - " -NoNewline
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ PASS" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Name: $($data.data.name)"
        Write-Host "Email: $($data.data.email)"
        Write-Host "Role: $($data.data.role)"
    } else {
        Write-Host "✗ FAIL" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ FAIL (Exception: $($_.Exception.Message))" -ForegroundColor Red
}

# Test 6: Register Customer (untuk test 403)
Write-Host "`n[Test 6] Register customer account..." -ForegroundColor Yellow
$customerPayload = @{
    email = $CUSTOMER_EMAIL
    password = $PASSWORD
    name = "Test Customer"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "$BASE_URL/api/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $customerPayload `
    -SkipHttpErrorCheck

Write-Host "Status: $($response.StatusCode) - " -NoNewline
if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 201) {
    Write-Host "✓ PASS" -ForegroundColor Green
} else {
    Write-Host "✗ FAIL" -ForegroundColor Red
}

# Test 7: Login Customer
Write-Host "`n[Test 7] Login as customer..." -ForegroundColor Yellow
$loginPayload = @{
    email = $CUSTOMER_EMAIL
    password = $PASSWORD
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginPayload `
        -SessionVariable 'customerSession' `
        -SkipHttpErrorCheck

    Write-Host "Status: $($response.StatusCode) - " -NoNewline
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ PASS" -ForegroundColor Green
    } else {
        Write-Host "✗ FAIL" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ FAIL (Exception: $($_.Exception.Message))" -ForegroundColor Red
}

# Test 8: Customer Try Access Seller Endpoint (expect 403)
Write-Host "`n[Test 8] Customer accessing /api/seller/products (expect 403)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/seller/products" `
        -Method GET `
        -WebSession $customerSession `
        -SkipHttpErrorCheck

    Write-Host "Status: $($response.StatusCode) - " -NoNewline
    if ($response.StatusCode -eq 403) {
        Write-Host "✓ PASS" -ForegroundColor Green
        Write-Host "Response: $($response.Content)"
    } else {
        Write-Host "✗ FAIL (expected 403)" -ForegroundColor Red
        Write-Host "Response: $($response.Content)"
    }
} catch {
    Write-Host "✗ FAIL (Exception: $($_.Exception.Message))" -ForegroundColor Red
}

# Test 9: Test Store Endpoint
Write-Host "`n[Test 9] GET /api/seller/store as seller (expect 200)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/seller/store" `
        -Method GET `
        -WebSession $sellerSession `
        -SkipHttpErrorCheck

    Write-Host "Status: $($response.StatusCode) - " -NoNewline
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ PASS" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Store: $($data.data.name)"
    } else {
        Write-Host "✗ FAIL" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ FAIL (Exception: $($_.Exception.Message))" -ForegroundColor Red
}

# Test 10: Logout Seller
Write-Host "`n[Test 10] Logout seller..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/seller/auth/logout" `
        -Method POST `
        -WebSession $sellerSession `
        -SkipHttpErrorCheck

    Write-Host "Status: $($response.StatusCode) - " -NoNewline
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ PASS" -ForegroundColor Green
    } else {
        Write-Host "✗ FAIL" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ FAIL (Exception: $($_.Exception.Message))" -ForegroundColor Red
}

# Test 11: Access After Logout (expect 401)
Write-Host "`n[Test 11] Access after logout (expect 401)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BASE_URL/api/seller/products" `
        -Method GET `
        -WebSession $sellerSession `
        -SkipHttpErrorCheck

    Write-Host "Status: $($response.StatusCode) - " -NoNewline
    if ($response.StatusCode -eq 401) {
        Write-Host "✓ PASS" -ForegroundColor Green
    } else {
        Write-Host "✗ FAIL (expected 401)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ FAIL (Exception: $($_.Exception.Message))" -ForegroundColor Red
}

Write-Host "`n=== TEST SUMMARY ===" -ForegroundColor Cyan
Write-Host "Test completed. Check results above." -ForegroundColor White
Write-Host "`nNote: Some tests may fail if database seeding or email verification is required." -ForegroundColor Gray
