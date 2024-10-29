# Klarna Payments Preview Tool

A Windows 95-styled tool for testing Klarna Payments SDK integration. This tool allows developers to test init, load, and authorize calls with different country configurations.

## Features

### 1. Initialize Klarna Payments
- Test the `Klarna.Payments.init()` call
- Input field for client token
- Shows both request and response

### 2. Load Payment Methods
- Test the `Klarna.Payments.load()` call
- Optional payment method category input
- Optional session data input
- Shows both request and response
- Displays payment methods in the Klarna container

### 3. Authorization
- Test the `Klarna.Payments.authorize()` call
- Optional payment method category input
- Optional session data input
- Built-in examples for different countries:
  - 🇮🇹 Italy (IT)
  - 🇺🇸 United States (US)
  - 🇬🇧 United Kingdom (GB)
  - 🇸🇪 Sweden (SE)
  - 🇩🇪 Germany (DE)
  - 🇪🇸 Spain (ES)
  - 🇫🇷 France (FR)

## Usage

1. **Init**
   - Paste your client token
   - Click "init" button
   - Check response

2. **Load**
   - (Optional) Enter payment method category
   - (Optional) Add session data
   - Click "load" button
   - Check the Klarna container for payment methods

3. **Authorize**
   - (Optional) Enter payment method category (same as load)
   - Use country buttons to load example session data
   - Click "authorize" button
   - Check response

## Payment Method Categories
Available categories:
- `pay_later`
- `pay_over_time`
- `pay_now`

## Example Data
Each country example includes:
- Billing & shipping addresses
- Purchase information
- Order details
- Store information
- All amounts with zero tax

## Development

### Files Structure 